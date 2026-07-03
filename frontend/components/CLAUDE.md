# components/

Reusable UI, one component per site section. ~40 components; you should not need to read them all — follow the conventions below and mirror one close analog.

## Server vs client

Components are **server components by default** (no pragma). Add `"use client"` as the first line only when the component needs state, effects, browser APIs, event handlers, context, or styled-jsx. Current client components: the donate family (`DonateProvider/DonateModal/DonateButton/Donate`), `NavOne`, `Footer`, the forms (`Contact`, `Volunteer`), the swiper users (`SliderOne`, `ClientsLogo`, `ClientsLogoTwo`, `MixerArea`), `EntryArea`, `VideoModal`, `Gallery`, `FaqArea`, `Map`. Everything presentational stays server-rendered.

## Style

- Functional components with arrow syntax, default-exported:
  ```js
  import React from 'react';
  const Thing = () => { return ( /* JSX */ ); };
  export default Thing;
  ```
- 4-space indentation. `import Link from 'next/link';` for internal links.
- Prefer hooks over class components. `NavOne.js` is the hooks reference (note: `usePathname` from `next/navigation`, never `next/router`).
- Markup is Bootstrap grid (`container` / `row` / `col-lg-*`) plus the site's shared CSS classes. Reuse existing classes (`theme-btn`, `section-heading`, `blog-item`, `recent-item`, `team-item`) before writing new CSS.
- Brand accent gold `#f1ae44`. Use inline `style={{ }}` only for small one-off custom bits (see `RecipientCard.js`, `Newsletter.js`); lean on classes otherwise.
- Plain `<img src="/images/..." />` (never `next/image`); assets live in `../public/`.
- External links always get `target="_blank" rel="noopener noreferrer"`. Link to PDFs/static files with a plain `<a>`, not `Link`.

## Props patterns

- Presentational sections take no props and drop straight into a page (`TeamArea`, `Causes`).
- Reusable pieces take simple props: `PageHeader` → `title`, optional `prev` + `link` (breadcrumb), `imgUrl`. `RecipientCard` → `recipient`.
- Data-list sections receive their array as a prop from an async page (`Newsletter` → `newsletters`, `AwardRecipients` → `recipients`, `EventsSection` → `events`) — the page loads via `lib/api.js`, the section renders. `EventsSection` splits upcoming/past by `eventDate` and falls back to Past Events so the section is never empty; the card badge (`eventBadge` in `event-format.js`) derives day/month from `eventDate`, and a null `slug` means "no detail page — don't link".

## Forms

`Contact`, `Volunteer`, and the `Footer` signup POST **structured fields** to the backend via `API_BASE_URL` from `../lib/client-config.js`. The client never chooses recipient/subject/body — that shape (`{to, subject, body}`) was an open relay and must not come back. Payloads are pinned by `scripts/form.test.mjs`.

## Good analogs to copy

- Section with a heading block: `TeamArea.js`.
- Data-driven list section (array prop from an async page): `Newsletter.js`, `AwardRecipients.js`, `PastEvents.js`.
- Card rendered from a data object: `RecipientCard.js`.
- Detail/inner page body with a sidebar + `Map`: `CoffeeWomenEmpowermentEventDetail.js`, `CommunityFieldDay2025EventDetail.js`.
- Small client overlay: `VideoModal.js` (plain CSS file, Escape/backdrop close).
