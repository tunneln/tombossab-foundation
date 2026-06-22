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
- Prefer hooks over class components. `NavOne.js` is the hooks reference; `NavTwo.js` is an older class component kept only for the `index2.js` demo — don't copy its style.
- Markup is Bootstrap grid (`container` / `row` / `col-lg-*`) plus the template's CSS classes. Reuse existing classes (`theme-btn`, `section-heading`, `blog-item`, `recent-item`, `team-item`) before writing new CSS.
- Brand accent gold `#f1ae44`. Use inline `style={{ }}` only for small one-off custom bits (see `RecipientCard.js`, `Newsletter.js`); lean on classes otherwise.
- Plain `<img src="/images/..." />` (never `next/image`); assets live in `../public/`.
- External links always get `target="_blank" rel="noopener noreferrer"`. Link to PDFs/static files with a plain `<a>`, not `Link`.

## Props patterns

- Most section components take no props and are dropped straight into a page (`Events`, `PastEvents`, `TeamArea`).
- Reusable pieces take simple props: `PageHeader` → `title`, optional `prev` + `link` (breadcrumb), `imgUrl`. `RecipientCard` → `recipient`. Data-list components receive their array as a prop from the page (`Newsletter` → `newsletters`) — the page loads the data, the component just renders it.

## Good analogs to copy

- Section with a heading block: `Events.js`, `TeamArea.js`.
- Card rendered from a data object: `RecipientCard.js`.
- Detail/inner page body with a sidebar + `Map`: `CoffeeEventDetail.js`, `EventsDetail.js`.
