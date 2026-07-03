# backend/

Spring Boot 3.5 / Java 21 / PostgreSQL 16 + Flyway. Standalone JSON API for the Vercel frontend; ships as a Docker image (see `../deploy/`). Package root: `org.tombossabfoundation.backend`.

## Layout (domain-oriented)

- `content/{recipient,newsletter,event}` — public read side. Each package: Entity, Repository, Service, Controller, Response record. **Response field names mirror `frontend/data/*.json` exactly** — the fixtures are the API's contract.
- `engagement/{contact,volunteer,subscription}` — public write side: submissions are persisted first, then a notification email is sent (best-effort).
- `notification/` — `@Async("mailExecutor")` outbound mail. From = the SMTP account (SPF/DMARC-correct), Reply-To = the submitter.
- `config/` — `SecurityConfig` (closed by default — new endpoints are added ABOVE `anyRequest().denyAll()`), CORS + rate-limit `@ConfigurationProperties`, async executor, OpenAPI info.
- `common/` — `ApiExceptionHandler` (RFC-9457 ProblemDetail; validation failures carry an `errors` field map) and `StatusResponse`.

## API

| Endpoint | Behavior |
|---|---|
| `GET /api/recipients` / `newsletters` / `events` | Seeded content, newest first (recipients tie-break within a year: seed order) |
| `POST /api/contact`, `POST /api/volunteer` | 202 + `{status:"accepted"}`; persisted, then emailed |
| `POST /api/subscriptions` | 201 new / 200 duplicate (idempotent); email normalized lowercase |

Swagger UI at `/swagger-ui`; health at `/actuator/health` (the only actuator endpoint exposed). POSTs are rate-limited 5/min/IP (bucket4j; `X-Forwarded-For`-aware — Caddy sets it).

## Add an endpoint (recipe)

1. Request/Response as records; jakarta validation annotations on request fields.
2. Entity + Repository + Service (`@Transactional`) in its domain package (a new feature area = a new sibling package).
3. Thin `@RestController`; open the exact path deliberately in `SecurityConfig` — `denyAll()` stays last.
4. Tests: `@WebMvcTest` slice with `@Import(SecurityConfig.class)` + `@MockitoBean` service; DB coverage in a `*IT` (Testcontainers).

## Database

Flyway migrations in `src/main/resources/db/migration/` — never edit an applied `V*`, always add the next number. Content seed migrations must update the matching `frontend/data/*.json` fixture in the same PR. `ddl-auto=validate`: entities must match the migrated schema exactly.

## Profiles & config

- default — no datasource configured (slice/unit tests run without Docker).
- `local` — `../docker-compose.dev.yml` Postgres + Mailpit (:8025 UI), CORS adds localhost:3000, relaxed rate limit.
- `prod` — env-injected `DB_URL`/`DB_USER`/`DB_PASSWORD`/`SMTP_PASSWORD` (from `deploy/.env` on the box). Never commit a secret.
