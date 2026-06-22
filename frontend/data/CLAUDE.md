# data/

JSON content for data-driven pages. Each file is a flat **array of objects**, read at build time via `getStaticProps` and sorted in the page (see `../pages/`).

## Conventions

- Every object has a string `id` slug: `"elim-girma-2025"`, `"march-2026"`.
- Keep a sortable field and sort newest-first in the page: `recipients.json` uses `year` (desc); `newsletters.json` uses `date` as `"YYYY-MM"` (desc via `localeCompare`).
- File paths in the JSON point at assets in `../public/` — `recipients.json` → `/recipients/*.jpg`; `newsletters.json` → `/newsletters/*.jpg` cover + `/newsletters/*.pdf` file.
- **Adding an entry = append an object + drop its asset(s) in `../public/`.** No component or page code should need to change.

## Generating newsletter assets

Copy the PDF into `../public/newsletters/`, then make a cover thumbnail with macOS Quick Look (ImageMagick here can't rasterize PDFs — no ghostscript):

```bash
qlmanage -t -s 600 -o /tmp "Some Newsletter.pdf"
sips -s format jpeg /tmp/"Some Newsletter.pdf.png" --out ../public/newsletters/<slug>-cover.jpg
```
<!-- claude-token-guard-start -->
## Token Hygiene (managed by claude-token-guard)
Project root: /Users/noelnegusse/Git/tombossab-foundation/frontend/data
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
