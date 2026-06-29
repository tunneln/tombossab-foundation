# components/

Reusable UI, one component per site section. ~40 components; you should not need to read them all — follow the conventions below and mirror one close analog.

## Style

- Functional components with arrow syntax, default-exported:
  ```js
  import React from 'react';
  const Thing = () => { return ( /* JSX */ ); };
  export default Thing;
  ```
- 4-space indentation. `import Link from 'next/link';` for internal links.
- Prefer hooks over class components. `NavOne.js` is the hooks reference.
- Markup is Bootstrap grid (`container` / `row` / `col-lg-*`) plus the site's shared CSS classes. Reuse existing classes (`theme-btn`, `section-heading`, `blog-item`, `recent-item`, `team-item`) before writing new CSS.
- Brand accent gold `#f1ae44`. Use inline `style={{ }}` only for small one-off custom bits (see `RecipientCard.js`, `Newsletter.js`); lean on classes otherwise.
- Plain `<img src="/images/..." />` (never `next/image`); assets live in `../public/`.
- External links always get `target="_blank" rel="noopener noreferrer"`. Link to PDFs/static files with a plain `<a>`, not `Link`.

## Props patterns

- Most section components take no props and are dropped straight into a page (`Events`, `PastEvents`, `TeamArea`).
- Reusable pieces take simple props: `PageHeader` → `title`, optional `prev` + `link` (breadcrumb), `imgUrl`. `RecipientCard` → `recipient`. Data-list section components receive their array as a prop from the page (`Newsletter` → `newsletters`, `AwardRecipients` → `recipients`) — the page loads/sorts the data, the section component renders it (and maps a per-item card where there is one, e.g. `AwardRecipients` → `RecipientCard`).

## Good analogs to copy

- Section with a heading block: `Events.js`, `TeamArea.js`.
- Data-driven list section (array prop from a page's `getStaticProps`): `Newsletter.js`, `AwardRecipients.js`.
- Card rendered from a data object: `RecipientCard.js`.
- Detail/inner page body with a sidebar + `Map`: `CoffeeWomenEmpowermentEventDetail.js`, `CommunityFieldDay2025EventDetail.js`.
<!-- claude-token-guard-start -->
## Token Hygiene (managed by claude-token-guard)
Project root: /Users/noelnegusse/Git/tombossab-foundation/frontend/components
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
