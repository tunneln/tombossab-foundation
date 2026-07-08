---
name: verify
description: Verify a change in this repo end-to-end — frontend build/tests/screenshots, backend unit/integration tests, or the full-stack local run. Use after any nontrivial code change, before committing, and always for visual/CSS/image changes.
---

# Verify a change

Pick the section(s) matching what changed. A change is "done" only when its checks pass.

## Frontend (anything under `frontend/`)

1. `cd frontend && npm run build && npm test`
   - Hermetic: with no `API_BASE_URL`, pages render the committed fixtures in `data/`. Do not point tests at the live API.
   - New page? The ROUTES coverage guard in `scripts/render.test.mjs` fails the suite until the route has an entry — add it **before** running tests.
2. Visual change (CSS, images, layout, responsive, slider, modal)? A passing build is **not** verification — render it:
   - `node scripts/shoot.mjs <label> [routes...]` → `.shots/<label>/<page>__<viewport>.png` (4 viewports).
   - Token frugality: screenshots are the biggest token spend in this repo. Prefer DOM assertions (Playwright against `scripts/next-server.mjs`) plus viewport-sized or cropped shots; avoid full-page captures of long pages (the homepage is ~11,600 px tall). Plan for **one** build+shoot cycle, not iterative reshooting.
   - Diff two labels with `magick compare -metric RMSE a.png b.png null:` (requires identical dimensions; lower = closer).
3. Final gate for visual work: compare against the **live site** — screenshot https://tombossabfoundation.org (network on, full page) vs the local build for the changed routes, and diff dimensions/RMSE.

## Backend (anything under `backend/`)

1. `cd backend && ./mvnw test` — unit + `@WebMvcTest` slices, no Docker needed.
2. Touched persistence, migrations, `SecurityConfig`, or mail? Also run `./mvnw verify` (adds `*IT` Testcontainers tests — Docker required). On macOS Docker runs via colima; these env vars are required or every `*IT` fails at Ryuk startup:
   ```bash
   export DOCKER_HOST="unix://$HOME/.colima/default/docker.sock"
   export TESTCONTAINERS_DOCKER_SOCKET_OVERRIDE=/var/run/docker.sock
   ```
3. New or changed endpoint? Confirm `SecurityConfig` opens the exact path and `anyRequest().denyAll()` is still last.

## Full-stack (data flow, forms, revalidation)

```bash
docker compose -f docker-compose.dev.yml up -d        # Postgres :5432, Mailpit UI :8025
cd backend && ./mvnw spring-boot:run -Dspring-boot.run.profiles=local
cd frontend && API_BASE_URL=http://localhost:8080 NEXT_PUBLIC_API_BASE_URL=http://localhost:8080 npm run dev
```

Prove it end-to-end: submit a form → row lands in Postgres **and** the notification appears in Mailpit (:8025); content pages render API data rather than fixtures.

## Report honestly

State exactly which checks ran and their results. If a check failed or was skipped, say so plainly — never describe a change as verified when it wasn't.
