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
