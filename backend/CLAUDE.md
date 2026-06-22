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
