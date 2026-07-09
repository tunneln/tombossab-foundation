# Testing

Two independent suites, one per deployable. Both are hermetic — no live network,
no real mail server, no shared state — so they run anywhere and in CI
(`.github/workflows/ci.yml` runs both on every push/PR).

## Frontend (`frontend/`)

```bash
cd frontend
npm run build     # hermetic: no API_BASE_URL -> pages render the committed fixtures
npm test          # node --test scripts/*.test.mjs
```

Node's built-in test runner + Playwright. Tests serve the production build via
`next start` (`scripts/next-server.mjs`) and block all external requests.

| Suite | Covers |
|---|---|
| `data.test.mjs` | Fixture integrity (recipients/newsletters/events): shape, unique ids/slugs, date formats, assets exist, newest-first ordering |
| `render.test.mjs` | Every route serves 200 with the exact `<title>`, `html[lang]`, shared chrome, meta tags; legacy 308 redirects; unknown route 404; **coverage guard** — a prerendered route missing from ROUTES fails |
| `links.test.mjs` | No dead internal links; `target="_blank"` ⇒ `rel="noopener"`; rendered list ordering; PDF links resolve |
| `form.test.mjs` | Contact/volunteer/subscription forms post their exact structured payloads to the right endpoints (open-relay shape must never return) and surface the success alert |
| `donate.test.mjs` | Self-hosted donate modal behavior at desktop/tablet/mobile |
| `images.test.mjs` | Every local `<img>` decodes; 1 MB budget (gallery exempt); entry-video JPEG swap |

Screenshots: `node scripts/shoot.mjs <label> [routes...]` → `.shots/<label>/<page>__<viewport>.png`
(4 viewports). Diff labels with ImageMagick `magick compare -metric RMSE`.

## Backend (`backend/`)

```bash
cd backend
./mvnw test      # unit + @WebMvcTest slices — no Docker needed
./mvnw verify    # adds *IT integration tests — Docker required (Testcontainers)
```

macOS note: Docker here runs via **colima**, and no env vars are needed — the
failsafe config in `backend/pom.xml` sets
`TESTCONTAINERS_DOCKER_SOCKET_OVERRIDE=/var/run/docker.sock` for the test JVM
(a no-op on Linux CI, where that is already the daemon socket).

Why it's needed at all: Testcontainers starts **Ryuk**, a small reaper container
that removes test containers when the JVM exits, and bind-mounts the Docker
socket into it. Mount source paths are interpreted by the *daemon*, which runs
inside the colima VM — so the macOS-side socket path
(`~/.colima/default/docker.sock`) is unmountable there, and every `*IT` fails at
startup. The override supplies the path as the daemon sees it. It must be an
environment variable: Testcontainers silently ignores `docker.socket.override`
in `~/.testcontainers.properties` (hence the pom, which works in any shell or
IDE). Client *connection* needs no setup either — the docker context resolves
the colima socket without `DOCKER_HOST`.

Conventions:

- `*Test` (surefire): one `@WebMvcTest` slice per controller with
  `@Import(SecurityConfig.class)` + `@MockitoBean` service — pins the HTTP
  contract, validation errors, and the security policy (denyAll, CORS
  preflights, 405s). Pure Mockito units for `NotificationService` and the
  rate-limit filter.
- `*IT` (failsafe): `AbstractPostgresIT` provides a singleton Postgres
  container. `ContentRepositoryIT` (`@DataJpaTest` against the real Flyway
  schema + seeds), `ApplicationIT` (full stack over HTTP with GreenMail:
  form POST → DB row → received email; seeded content end-to-end).

## Full-stack local run (manual E2E)

```bash
docker compose -f docker-compose.dev.yml up -d          # Postgres + Mailpit (UI :8025)
cd backend && ./mvnw spring-boot:run -Dspring-boot.run.profiles=local
cd frontend && API_BASE_URL=http://localhost:8080 NEXT_PUBLIC_API_BASE_URL=http://localhost:8080 npm run dev
```

Forms land in Postgres and appear in Mailpit; content pages render from the API.
