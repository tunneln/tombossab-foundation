# Decoupling Refactor — Design & Rationale

*Written July 2026, before implementation. This is the "why" document; the phase-by-phase
"what" lives in the PR descriptions and `deploy/RUNBOOK.md`.*

## The problem

The site today is one artifact: a Spring Boot jar that contains the statically-exported
Next.js site and serves it alongside a single email endpoint. That coupling shows up
everywhere — the Maven build has to build the frontend, a content edit requires a full
backend redeploy, the frontend can't use any server feature (no auth, no runtime data),
and the roadmap (volunteer portal, scholarship applications, web shop) has nowhere to grow.
There are also two concrete problems shipping in production right now:

- **`POST /api/emails/send` is an open relay.** The browser sends `{to, subject, body}`
  and the server sends it. Anyone with `curl` can make the foundation's SMTP account
  email anyone, with any content.
- **Next.js 13.5.7 has known CVEs** and is two major versions behind.

## Target architecture

```
   Visitors ──▶ Vercel (tombossabfoundation.org)
                  Next.js 15, App Router, SSG + ISR
                  │  fetch at build/revalidate time      │  form POSTs from the browser
                  ▼                                      ▼
   Lightsail box (api.tombossabfoundation.org)
     Caddy (TLS) ─▶ Spring Boot 3.5 API ─▶ PostgreSQL 16
                        │                     (Docker Compose, internal network)
                        └─▶ SMTP notifications (async)
```

One repo, two deployables: Vercel builds `frontend/` on push; GitHub Actions builds the
backend image and deploys it to the box over SSH.

## Decisions and why

### Frontend on Vercel, backend stays on Lightsail
Vercel is the native host for Next.js — zero-config builds, CDN, preview deploys per PR.
The Lightsail box you already pay for keeps the backend: at this scale a managed PaaS buys
little, and running the stack yourself (Compose, TLS, backups, CI-driven deploys) is a
better engineering story than a dashboard.

### SSG + ISR instead of static export
Public pages stay pre-rendered (same speed as today), but Vercel runs a thin Next server,
which unlocks: **on-demand revalidation** (a content change regenerates one page in
seconds instead of rebuilding the whole site), and — critical for the roadmap —
**middleware, per-user server rendering, and API routes**, none of which exist in a static
export. A portal or shop simply cannot be built on `next export`; doing this move now
means doing it once.

### Next 15 + React 19, full App Router
Your call to do the full migration now rather than staying on the Pages Router. What it
buys: Server Components (pages that fetch data ship no JS for it), the `metadata` API,
layouts, and the architecture every future Next feature targets. What it costs: every page
is touched, so the migration happens **at visual parity, on fixtures, behind a
60-screenshot before/after diff** — the riskiest phase gets the hardest gate. React 19 is
forced anyway: `react-visibility-sensor` uses an API React 19 removed, so it's replaced
regardless (by `react-countup` v6's built-in scroll-spy).

### Spring Boot 3.5, domain-oriented packages
Not `controller/` + `service/` layers, but domains:
`content/` (public read side: recipients, newsletters, events), `engagement/` (public
write side: contact, volunteer, subscriptions), `notification/` (outbound email),
`config/` + `common/` (cross-cutting). Each new roadmap feature is a new sibling package
with the same internal shape (entity → repository → service → controller → DTO records),
not a new layer smeared across the codebase. The volunteer portal and scholarship
application extend `engagement`; the shop becomes a sibling domain.

### PostgreSQL + Flyway, content as versioned migrations
Postgres because it's the boring, correct default (and `jsonb` maps the list-shaped fields
like `highlights`/`story` without extra tables). Flyway because schema history belongs in
git. Content management deliberately stays a **git workflow**: adding a recipient means
committing a `V5__...sql` seed migration plus the matching JSON fixture — the same motion
as editing JSON today, with no admin auth surface to build or secure yet. When the admin
API/portal arrives, it slots into `SecurityConfig` as an authenticated matcher.

### Testcontainers over H2 for database tests
Tests run Flyway against a real Postgres in Docker, not an in-memory lookalike. H2 would
force compatibility-mode SQL and silently diverge from what runs in production (`jsonb`,
identity columns). Cost: Docker is required to run the integration suite; unit and slice
tests still run without it.

### Security model
- The open relay dies: clients send **structured fields** (`{name, email, message}`), the
  server decides recipient and formatting.
- `SecurityFilterChain` uses an explicit permit-list of the six public endpoints and ends
  with `anyRequest().denyAll()` — new endpoints are locked until deliberately opened.
- **CORS allowlist** of exactly the production domains (+ localhost in the local profile).
- **Rate limiting** (bucket4j, 5 POSTs/min/IP, in-memory) — enough to stop drive-by form
  spam on a single instance; the filter's backing store can go distributed later without
  redesign.
- Validation on every request DTO (jakarta annotations); errors return RFC-9457
  `ProblemDetail` without leaking internals.
- Postgres sits on an internal Docker network with **no published port**; secrets live
  only in env files on the box and in GitHub secrets.

### Email redesign: persist first, notify async
A form submission is **data first** — it's written to Postgres, then a notification email
is sent `@Async` so a slow/down SMTP server can't fail or delay the user's request. The
message uses `From = the authenticated SMTP account` (SPF/DMARC-correct; today it forges
From as the recipient) and `Reply-To = the submitter`, so replying still works naturally.
Submissions survive even if email delivery fails — nothing lands only in an inbox.

### Caddy in Docker replaces nginx on the host
You run nginx as the reverse proxy today. After cutover the box serves exactly one
hostname (`api.`), and Caddy does that with a 5-line config that lives **in the repo**,
plus fully automatic TLS issuance/renewal (no certbot cron on the host). The whole backend
becomes `docker compose up` — reproducible from a fresh box in minutes. nginx keeps
serving the old site untouched throughout the transition; the runbook retires it at
cutover, and DNS-revert remains the rollback at every step.

### ISR freshness: deploy-triggered, with a safety net
Content only changes when a seed migration deploys, so the deploy workflow pings a
secret-protected `POST /api/revalidate` on the frontend (`revalidateTag('content')`) —
instant freshness exactly when it can change. Pages also carry `revalidate: 3600` as a
belt-and-braces fallback if the ping is ever missed.

### Hermetic builds: fixture fallback
`lib/api.js` fetches from the API when `API_BASE_URL` is set (Vercel prod) and falls back
to committed JSON fixtures when it isn't (CI, local dev, tests) or when the fetch fails
(build resilience — a backend blip can't break a deploy; fallbacks log loudly so Vercel
logs surface them). This is what keeps the entire test suite offline and deterministic
after the refactor, and it's why every content seed migration must update its fixture in
the same PR.

### Testing strategy
Coverage only grows. Backend: ~10 tests become ~35 — a `@WebMvcTest` slice per controller
(the old email contract tests carry forward under the new endpoints), repository tests
against real Postgres, security/CORS/rate-limit tests, and one end-to-end
`@SpringBootTest` with Testcontainers + GreenMail proving form → database row → received
email. Frontend: all five suites survive (the static-file server fixture becomes a
`next start` fixture), plus a new `form.test.mjs` that intercepts the three POSTs and pins
their payloads. The two tests that retire (`HtmlControllerTest`, the From==To pin in
`EmailServiceTest`) are exactly the ones the old suite documented as tied to the old
design.

### Cutover: nothing risky until DNS moves
The old jar + nginx serve the live site untouched through every phase. The new stack comes
up on the box alongside it, gets smoked on `api.` (a brand-new hostname — zero traffic
risk), the Vercel deploy is verified against the real API cross-origin, and only then does
the apex DNS move. Rollback at any point is a DNS revert; the old jar stays installed for
a grace week.

## Phases

| Phase | Delivers | Gate |
|---|---|---|
| A | Standalone backend: DB, security, new API, ~35 tests | `./mvnw verify` green + curl checklist |
| B | Dockerfile, Compose (dev + prod), Caddy, backups, CI/CD workflows | CI green; prod stack boots locally |
| C | App Router migration on fixtures, test harness rework | 6 suites green; 60-screenshot parity diff |
| D | Forms → new API, ISR revalidation route | Full-stack local E2E; hermetic build proof |
| E | Docs: CLAUDE.mds, TESTING.md, README, cutover runbook | Documented commands run verbatim |
| F | Ops cutover (runbook, no code) | Live site on new architecture; rollback armed |

## Where the roadmap lands later

- **Volunteer portal / scholarship application** — new `engagement` aggregates + the first
  authenticated matchers in `SecurityConfig`; portal UI is App Router pages using
  middleware for session guards.
- **Web shop** — new sibling domain in the backend; payment provider webhooks are just
  more `engagement`-style endpoints.
- **Newsletter improvements** — subscribers are already first-class rows; a real campaign
  send becomes a `notification` feature.
- **Admin API/UI** — CRUD controllers on `content`, opened deliberately in the security
  permit-list, replacing seed migrations when the git workflow stops scaling.
