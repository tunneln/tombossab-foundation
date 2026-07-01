# Testing

Two independent suites, one per part of the monorepo. Neither talks to the network
or a real mail server, so both are safe to run anywhere and in CI.

| Suite | Runner | Location | What it needs |
|-------|--------|----------|---------------|
| Frontend | Node's built-in test runner + Playwright | `frontend/scripts/*.test.mjs` | a fresh static export in `frontend/out/` |
| Backend | JUnit 5 (Spring Boot Test) | `backend/src/test/java/**` | JDK 21 |

## Running

### Frontend

The functional tests run against the **exported** site, so build it first:

```bash
cd frontend
npm run build && npm run export     # produces frontend/out/
npm test                            # runs every scripts/*.test.mjs
```

`npm test` is `node --test scripts/*.test.mjs`, so **any new `*.test.mjs` file is
picked up automatically** — no config to touch. To run one file:
`node --test scripts/data.test.mjs`.

`data.test.mjs` is pure (no browser, no export) and runs on its own in
milliseconds; the rest launch headless Chromium against a tiny in-process file
server (`serve-out.mjs`) with all external requests blocked (offline + deterministic).

### Backend

A plain `./mvnw test` also **builds the whole frontend first** — the Maven build
couples the two parts (the `frontend-maven-plugin` + antrun copy are bound to
`generate-resources`, which runs before `test`). That's correct for producing the
jar, but slow for a backend-only change. To run just the Java tests, invoke the
goals directly so the lifecycle (and the frontend build) is skipped:

```bash
cd backend
mvn -q resources:resources compiler:compile resources:testResources compiler:testCompile surefire:test
```

> If `./mvnw` fails with a Maven-distribution SHA-256 error, the wrapper's pinned
> distribution checksum is stale — use a system `mvn` (3.9.x, JDK 21) as above, or
> fix `.mvn/wrapper/maven-wrapper.properties`.

## What's covered

### Frontend
- **`data.test.mjs`** — *unit.* Integrity of `data/recipients.json` and
  `data/newsletters.json`: required fields, unique ids/slugs/dates, valid
  `year` / `YYYY-MM` formats, month↔date consistency, and that every referenced
  photo / cover / PDF actually exists under `public/`. Also pins the newest-first
  ordering contract each page's `getStaticProps` relies on.
- **`render.test.mjs`** — *functional.* Every user-facing route serves via **both**
  its clean URL and its `.html` file (the mapping the backend provides), has the
  exact `<title>` (and the naming convention), and renders the shared chrome
  (NavOne, Footer, a donate CTA, viewport + description meta, the PageHeader banner
  on inner pages). A coverage guard fails if a new page is exported without a test.
- **`links.test.mjs`** — *functional.* No dead internal links on any core page;
  every `target="_blank"` link carries `rel="noopener"`; the data-driven lists
  render newest-first; newsletter PDF links resolve.
- **`donate.test.mjs`, `images.test.mjs`** — pre-existing functional suites for the
  self-hosted donate modal and the image-weight/asset budget.

### Backend
- **`EmailControllerTest`** — `@WebMvcTest` slice (service mocked). Pins the
  `POST /api/emails/send` HTTP contract the frontend newsletter form depends on:
  status codes, confirmation body, request-body → service mapping, malformed JSON → 400.
- **`HtmlControllerTest`** — `@WebMvcTest` slice for the clean-URL forwarding
  (`/about` → `/about.html`), nested event pages, the two legacy 301 redirects, and
  the dot-exclusion rule that lets real static files pass through.
- **`EmailServiceTest`** — pure Mockito unit. Verifies the `SimpleMailMessage` is
  assembled from the arguments and sent. (It also pins that the service currently
  sets `From == To`; see the note in the test — brittle if reused for user-facing mail.)
- **`TombossaBFoundationApplicationTests`** — context-loads smoke test.

## Conventions for new tests

- **Frontend unit** (pure data / helpers): add a `*.test.mjs` using `node:test` +
  `node:assert/strict`, no browser. Model it on `data.test.mjs`.
- **Frontend functional** (anything rendered): reuse `serve-out.mjs`
  (`startServer` + `blockExternal`) so tests stay offline and hermetic. Model it on
  `render.test.mjs`.
- **Backend**: prefer thin slices (`@WebMvcTest` for controllers, plain Mockito for
  services) over `@SpringBootTest` so tests stay fast and never touch SMTP/DB.
  Name files `*Test.java` (Surefire's default) and mirror the `main/` package path.

## After the planned refactor (Vercel frontend + standalone backend + DB)

The suites were written to survive the split:

- The frontend tests are **already hermetic** and drive the exported site directly,
  so they move to a Vercel-hosted frontend unchanged.
- The backend tests are **slices**, so decoupling the frontend won't break them —
  **except `HtmlControllerTest`**, which is intentionally tied to today's
  "backend serves the static site" design and should retire with `HtmlController`
  when the frontend leaves.
- When the database and new endpoints land, add `@DataJpaTest` for repositories and
  `@WebMvcTest` (mocked service) for the new controllers, keeping one broader
  `@SpringBootTest` integration test per feature. Use an in-memory DB (H2) and, for
  email, an in-JVM SMTP fake (e.g. GreenMail) rather than a live server.

## Known gaps / good next tests

- No page ships an `<h1>` or an `<html lang>` — both are SEO/a11y wins and would
  make natural assertions once fixed.
- The `contact`, `apply`, and footer-newsletter forms have no tests for
  client-side validation or their submit path to `POST /api/emails/send`.
- No automated accessibility pass (e.g. axe-core against the exported pages).
