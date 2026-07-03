# app/

App Router: `x/page.js` is route `/x`. Everything is a server component unless marked `"use client"`.

## Standard page shape

```js
import React from 'react';
import NavOne from "../../components/NavOne";
import PageHeader from "../../components/PageHeader";
import SomeSection from "../../components/SomeSection";
import Footer from "../../components/Footer";

export const metadata = { title: "Tombossa B Foundation | Something" };

const SomethingPage = () => {
    return (
        <>
            <NavOne />
            <PageHeader title="Something" />
            <SomeSection />
            <Footer />
        </>
    );
};

export default SomethingPage;
```

- Component named `XPage`, default-exported.
- Title format `"Tombossa B Foundation | X"`; home has no title export (inherits the bare root title).
- Sub-pages add a breadcrumb: `<PageHeader prev="Events" link="/events" title="..." />` (see `events/[slug]/page.js`).
- Keep markup/logic in section components, not pages.
- **New page ⇒ add a ROUTES entry in `../scripts/render.test.mjs`** — the coverage guard fails the suite for any prerendered route it doesn't know.

## Data-driven pages

Async server component + a `lib/api.js` getter (API fetch with ISR caching, falling back to the committed fixture in `data/`):

```js
import { getRecipients } from '../../lib/api';
export const metadata = { title: "Tombossa B Foundation | Scholarship | Award Recipients" };

const AwardRecipientsPage = async () => {
    const recipients = await getRecipients();
    return ( /* ...sections receiving the array as a prop... */ );
};
```

See `award-recipients/`, `newsletters/`, `events/`. Event detail pages: `events/[slug]/page.js` maps slugs to bespoke detail components via its `DETAILS` registry + `generateStaticParams` (`dynamicParams = false` — unknown slugs 404).

## layout.js owns the document

- The stylesheet `<link>`s in **source order with a single `precedence="site"`** — order is load-bearing (responsive.css overrides style.css overrides bootstrap). The site's CSS is runtime files under `public/`; never convert them to bundler imports.
- Root `metadata` (description, OG/Twitter, `metadataBase`) and the favicon.
- `DonateProvider` wrapping children (the app-level donate modal survives navigation).
- The classic sync `<script>` tags for `accordion.min.js` / `glightbox.min.js` — they define globals that must exist before components mount; keep them synchronous, not `next/script`.
- Don't switch fonts to `next/font` without a screenshot-parity pass.

## Special files

`not-found.js` (404 with full chrome), `error.js` (client, runtime errors), `api/revalidate/route.js` (secret-protected `revalidateTag('content')` — pinged by the backend deploy workflow).
