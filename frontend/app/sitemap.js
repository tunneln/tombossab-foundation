import { generateStaticParams as eventSlugs } from './events/[slug]/page';

const SITE = 'https://tombossabfoundation.org';

// Public pages for search engines (served at /sitemap.xml). /sponsor is left out
// while it's unlinked from the site. Event detail URLs come from that route's
// own static params, so they can't drift from the pages that actually exist.
const PAGES = [
    '/', '/gala', '/about', '/events', '/award-recipients', '/apply', '/donatenow',
    '/volunteer', '/contact', '/newsletters', '/causes', '/gallery', '/team',
];

export default function sitemap() {
    const events = eventSlugs().map(({ slug }) => `/events/${slug}`);
    return [...PAGES, ...events].map((path) => ({ url: `${SITE}${path === '/' ? '' : path}` }));
}
