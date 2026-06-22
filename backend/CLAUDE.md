# backend/

Spring Boot 3.3 / Java 21. Serves the exported frontend as static resources and exposes a small email API. Package root: `org.tombossabfoundation.backend`.

> **Refactor-fragile:** a planned refactor adds a database and more endpoints, and decouples the frontend (it will no longer be served from here). Expect this folder to grow and this file to need rewriting — keep additions minimal until then.

## Layout & conventions

- `controller/` — web entry points; `service/` — business logic injected with `@Autowired`.
- `@RestController` for JSON APIs (`EmailController`); `@Controller` for view/URL forwarding (`HtmlController`, which maps clean URLs like `/about` → `/about.html`).
- Current API: `POST /api/emails/send` with body `{ to, subject, body }` → `EmailService` (SMTP via `JavaMailSender`).
- Config in `src/main/resources/application.properties`; the SMTP password is left blank in the repo and injected at runtime — never commit a real secret here.

## Build

- `./mvnw package` builds the frontend (via `frontend-maven-plugin`), copies `../frontend/out/` into `static/`, and produces the runnable jar.
<!-- claude-token-guard-start -->
## Token Hygiene (managed by claude-token-guard)
Project root: /Users/noelnegusse/Git/tombossab-foundation/backend
Language: Java


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
