# Tombossa B Foundation

Nonprofit website. Decoupled monorepo:

- `frontend/` — Next.js 15 App Router (React 19), hosted on Vercel. Public pages are SSG + ISR.
- `backend/` — Spring Boot 3.5 / Java 21 API + PostgreSQL 16 (Flyway). Runs in Docker Compose behind Caddy on Lightsail at `api.tombossabfoundation.org`.
- `deploy/` — production compose stack, Caddyfile, backups, and the cutover RUNBOOK.
- CI/CD: `.github/workflows/ci.yml` tests both sides; `deploy.yml` ships the backend image (GHCR → SSH → compose up → ISR revalidate ping).

Design rationale for the architecture lives in `docs/refactor-plan.md`.

## Commands

- Frontend dev: `cd frontend && npm run dev` (http://localhost:3000 — renders committed fixtures; prefix `API_BASE_URL=http://localhost:8080 NEXT_PUBLIC_API_BASE_URL=http://localhost:8080` to use the local API)
- Frontend build + tests: `cd frontend && npm run build && npm test`
- Local backend deps: `docker compose -f docker-compose.dev.yml up -d` (Postgres :5432, Mailpit UI :8025)
- Backend run: `cd backend && ./mvnw spring-boot:run -Dspring-boot.run.profiles=local`
- Backend tests: `./mvnw test` (no Docker) · `./mvnw verify` (adds integration tests; needs Docker — macOS/colima env vars in TESTING.md)

## Verification — definition of done

- Frontend change: `cd frontend && npm run build && npm test` must be green. New page ⇒ add its ROUTES entry **before** running tests.
- Visual/CSS/image change: a passing build is not proof — render it with `node frontend/scripts/shoot.mjs <label> [routes...]` and compare. Be token-frugal: viewport/cropped shots + DOM assertions, one build+shoot cycle (the homepage is ~11,600 px tall full-page). Final gate: diff against the live site.
- Backend change: `cd backend && ./mvnw test`; also `./mvnw verify` when touching migrations, persistence, or `SecurityConfig`.
- Content change: follow the `content-update` skill (migration + fixture + assets + tests, all in one PR).
- Full recipes live in the project `verify` skill. Never report a change as done without stating which checks actually ran and their results.

## Working style

- Do only what the task requires — no unrequested refactors, helpers, or defensive handling for cases that can't happen.
- Ground every progress claim in a tool result from this session; if something isn't verified yet, say so explicitly.
- For minor choices (naming, formatting, which of two equivalent approaches), pick a reasonable option and note it instead of asking; ask first only for scope changes or destructive actions.
- Lead summaries with the outcome, in complete sentences — no working shorthand or arrow chains.

## Data flow — the one rule that matters

Content (recipients, newsletters, events) lives in Postgres, seeded by versioned Flyway migrations. `frontend/lib/api.js` fetches it with ISR caching (`tags: ['content']`, revalidate 3600) and falls back to the committed JSON in `frontend/data/` whenever `API_BASE_URL` is unset (CI, tests, local dev) or the fetch fails. **A content change = a new Flyway seed migration + the matching fixture update in the same PR.** The backend deploy workflow POSTs the frontend's secret-protected `/api/revalidate` so changes appear immediately.

## Frontend conventions

- Routes in `frontend/app/` (see `app/CLAUDE.md`). Standard page: `NavOne → PageHeader → [section components] → Footer`, plus `export const metadata = { title: 'Tombossa B Foundation | X' }`.
- One component per section in `frontend/components/` — server components by default, `"use client"` only for interactivity (see `components/CLAUDE.md`).
- Brand accent gold `#f1ae44`. Reuse the shared classes (`theme-btn`, `section-heading`, `blog-item`, `recent-item`, `slide-bg*`) instead of bespoke CSS. Site styling is runtime CSS under `public/` (`css/` + `plugins/`) whose order is load-bearing — managed in `app/layout.js`, do not convert to bundler imports.
- Plain `<img>`, never `next/image`. Static assets in `frontend/public/`; PDF/static links get `<a target="_blank" rel="noopener noreferrer">`.
- Nav is `NavOne.js`; homepage slider is `SliderOne.js` (`slide-bg*` classes in style.css + responsive.css, never inline backgrounds).
- New page ⇒ add its ROUTES entry in `frontend/scripts/render.test.mjs` (the coverage guard fails the suite otherwise).

## Backend

See `backend/CLAUDE.md`. Public surface: `GET /api/{recipients,newsletters,events}`, `POST /api/{contact,volunteer,subscriptions}`. Security is closed-by-default (`anyRequest().denyAll()`), CORS-allowlisted to the production domains, POSTs rate-limited per IP. Swagger at `/swagger-ui`.

## Gotchas

- PDF cover thumbnails: use macOS `qlmanage` — ImageMagick here lacks ghostscript and can't rasterize PDFs.
- Vercel preview deploys are deliberately NOT in the backend CORS allowlist — previews render fixtures.

## Git

- Do **not** add `Co-Authored-By` trailers to commit messages.
- Commit messages should be as concise as possible.
