# pages/

File-based routing: each file is a route (`about.js` → `/about`). Clean URLs on the served static site are handled by the backend `HtmlController`.

## Standard page shape

```js
import React from 'react';
import Layout from "../components/Layout";
import NavOne from "../components/NavOne";
import PageHeader from "../components/PageHeader";
import Footer from "../components/Footer";
import SomeSection from "../components/SomeSection";

const SomethingPage = () => {
    return (
        <Layout pageTitle="Tombossa B Foundation | Something">
            <NavOne />
            <PageHeader title="Something" />
            <SomeSection />
            <Footer />
        </Layout>
    );
};

export default SomethingPage;
```

- Component is named `XPage` and default-exported.
- `pageTitle` format: `"Tombossa B Foundation | X"` (home is just `"Tombossa B Foundation"`).
- Sub-pages add a breadcrumb: `<PageHeader prev="Events" link="/events" title="..." />` (see `coffee-women-empowerment.js`).
- Compose the page from section components in `../components/`; keep markup/logic in the component, not the page.

## Data-driven pages (SSG)

Read JSON at build time and sort in the page, then pass to a component:

```js
import data from '../data/things.json';
export async function getStaticProps() {
    const things = [...data].sort(/* newest first */);
    return { props: { things } };
}
```

See `award-recipients.js` (sorts `recipients.json` by year desc) and `newsletter.js` (sorts `newsletters.json` by `date` string desc). Note: static export means **no `getServerSideProps` / no API routes** — build-time only.

## Don't treat as real

`index2.js` is a leftover template demo (uses `NavTwo`). The live home page is `index.js`.
<!-- claude-token-guard-start -->
## Token Hygiene (managed by claude-token-guard)
Project root: /Users/noelnegusse/Git/tombossab-foundation/frontend/pages
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
