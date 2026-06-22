# Tombossa B Foundation

Nonprofit website. Monorepo with two parts:

- `frontend/` — Next.js 13 site, **statically exported** to `frontend/out/`.
- `backend/` — Spring Boot 3 / Java 21. Serves the exported static site and exposes a small email API.

The Maven build (`backend/pom.xml`) couples them: it builds the frontend and copies `frontend/out/` into the backend's `static/`.

> **Heads-up:** a refactor to decouple these (Vercel-hosted frontend + standalone Spring Boot + a database) is planned. The build coupling and the static-export constraints below are expected to change — keep this file lean and update it after that lands.

## Commands

- Frontend dev: `cd frontend && npm run dev` (http://localhost:3000)
- Frontend build: `cd frontend && npm run build`
- Full jar (builds frontend too): from `backend/`, `./mvnw package`

## Frontend conventions

- Pages live in `frontend/pages/` (file = route). A standard page is `Layout → NavOne → PageHeader → [section components] → Footer`. See `pages/causes.js`, `pages/award-recipients.js`.
- One component per section in `frontend/components/`.
- Data-driven pages: JSON in `frontend/data/` + `getStaticProps`, sorted in the page. See `award-recipients.js` + `data/recipients.json`, and `newsletter.js` + `data/newsletters.json`.
- Brand accent is gold `#f1ae44`. Reuse the template's classes (`theme-btn`, `section-heading`, `blog-item`, `recent-item`, `slide-bg*`) instead of writing bespoke CSS.
- Use plain `<img>`, not `next/image`. Static assets go in `frontend/public/` (e.g. `images/`, `newsletters/`).
- Link to PDFs / static files with `<a href="..." target="_blank" rel="noopener noreferrer">`.
- The live site's nav is `NavOne.js`. `NavTwo.js` is only used by the `index2.js` template demo — low stakes.
- Homepage slider is `components/SliderOne.js` (Swiper). Slides use `slide-bg*` CSS classes or an inline `background` image.

## Gotchas

- Static export ⇒ **no SSR, no Next API routes, no runtime data** (until the planned refactor).
- To generate PDF cover thumbnails, use macOS `qlmanage` — ImageMagick here lacks ghostscript and can't rasterize PDFs.
- `HtmlController` maps clean URLs to the exported files (`/about` → `/about.html`).

## Backend

- `POST /api/emails/send` with `{ to, subject, body }` → `EmailService` (SMTP). Config in `application.properties`; the SMTP password is injected and left blank in the repo.

## Git

- Do **not** add `Co-Authored-By` trailers to commit messages.
<!-- claude-token-guard-start -->
## Token Hygiene (managed by claude-token-guard)
Project root: /Users/noelnegusse/Git/tombossab-foundation
Language: Unknown


- Never say 'continue where you left off' after a rate limit (P2).
  Instead: start fresh with a one-paragraph summary of last completed file.
- Run /clear between unrelated tasks and at turn 30 (P3/P6).
- Run /compact before resuming sessions longer than 20 turns.
- Keep .claudeignore updated — node_modules/, dist/, .git/, build/ must be excluded (P7).
- Only connect MCP servers you need for this task. Disconnect others (P8).
<!-- claude-token-guard-end -->

## Stable Context

<!-- stable-context: do not remove this section -->
### Project
This is **claude-token-guard** — a CLI tool that audits Claude Code projects
for token hygiene anti-patterns and provides real-time monitoring via
`ctg watch` and `ctg dashboard`.

### Key Commands
- `ctg audit` — scan for anti-patterns
- `ctg fix --auto` — apply all safe fixes
- `ctg watch` — live token monitoring (terminal)
- `ctg dashboard` — live browser dashboard
- `ctg test` — run anti-pattern test scenarios

### Architecture
- `bin/ctg.js` — CLI entry point
- `src/audit.js` — pattern detection (P1–P10)
- `src/fixer.js` — auto-fix implementations
- `src/monitor.js` — JSONL tail + spike detection
- `src/dashboard.js` — SSE server + browser UI
- `src/reporter.js` — formatted audit output
