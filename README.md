# Tombossa B Foundation

Website for the Tombossa B Foundation — a nonprofit created in honor of my late
father, empowering Eritrean and East African youth communities through
education, support, and opportunity. Live at
[tombossabfoundation.org](https://tombossabfoundation.org).

## Architecture

```
  Visitors ──▶ Vercel — Next.js 15 (App Router, React 19), SSG + ISR
                 │ content fetch (build/revalidate)     │ form POSTs (browser)
                 ▼                                      ▼
  AWS Lightsail — api.tombossabfoundation.org
    Caddy (auto-TLS) ─▶ Spring Boot 3.5 API ─▶ PostgreSQL 16 (internal network)
                            └─▶ async SMTP notifications
```

- **Frontend** (`frontend/`): all public pages pre-rendered; content pages use
  ISR with tag-based revalidation. Committed JSON fixtures keep builds and the
  test suite fully offline and act as a production fallback.
- **Backend** (`backend/`): domain-oriented Spring Boot API (content read side,
  engagement write side, async notifications). Closed-by-default security,
  CORS allowlist, per-IP rate limiting, RFC-9457 error responses, Flyway
  migrations, OpenAPI docs at `/swagger-ui`.
- **Infra** (`deploy/`): Docker Compose (app + Postgres + Caddy), nightly
  `pg_dump` to S3, GitHub Actions CI/CD (backend image → GHCR → SSH deploy →
  ISR revalidate ping). Cutover/ops runbook in `deploy/RUNBOOK.md`.

## Quickstart

```bash
# Frontend only (renders committed fixture content)
cd frontend && npm ci && npm run dev

# Full stack
docker compose -f docker-compose.dev.yml up -d        # Postgres + Mailpit
cd backend && ./mvnw spring-boot:run -Dspring-boot.run.profiles=local
cd frontend && API_BASE_URL=http://localhost:8080 NEXT_PUBLIC_API_BASE_URL=http://localhost:8080 npm run dev
```

Tests: `cd frontend && npm run build && npm test` · `cd backend && ./mvnw verify` — see `TESTING.md`.

## Content updates

Content lives in Postgres, seeded by versioned Flyway migrations. Adding a
recipient/newsletter/event = one seed migration + the matching JSON fixture
update in the same PR; the deploy pipeline regenerates the affected pages
within seconds via the ISR revalidation webhook.
