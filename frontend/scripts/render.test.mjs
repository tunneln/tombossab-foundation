// Per-route health checks for the static export.
//
// For every page the site ships, this asserts the "shell" every route must have:
// it serves (via both the clean URL and the .html file — the two ways the backend
// HtmlController exposes it), carries the right <title>, and renders the shared
// chrome (nav, footer, a donate CTA, the required meta tags). It also fails if a
// NEW page is exported without a matching entry here, so route coverage can't
// silently rot.
//
// Prereq: build the export first, then run:
//   npm run build && npm run export
//   node --test scripts/render.test.mjs      (or: npm test)
import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { chromium } from 'playwright';
import { OUT_DIR, startServer, blockExternal } from './serve-out.mjs';

// The full set of user-facing routes and their exact titles. Home is bare; every
// other page follows the "Tombossa B Foundation | X" convention (pages/CLAUDE.md).
// Titles are the DECODED form (Playwright's page.title() unescapes &amp; etc.).
const ROUTES = [
  { path: '/',                                  title: 'Tombossa B Foundation',                                     home: true },
  { path: '/about',                             title: 'Tombossa B Foundation | About Us' },
  { path: '/apply',                             title: 'Tombossa B Foundation | Scholarship | Application' },
  { path: '/award-recipients',                  title: 'Tombossa B Foundation | Scholarship | Award Recipients' },
  { path: '/causes',                            title: 'Tombossa B Foundation | Causes' },
  { path: '/contact',                           title: 'Tombossa B Foundation | Contact' },
  { path: '/donatenow',                         title: 'Tombossa B Foundation | Donate Now' },
  { path: '/events',                            title: 'Tombossa B Foundation | Event' },
  { path: '/gallery',                           title: 'Tombossa B Foundation | Gallery' },
  { path: '/newsletters',                       title: 'Tombossa B Foundation | Newsletters' },
  { path: '/sponsor',                           title: 'Tombossa B Foundation | Sponsors' },
  { path: '/team',                              title: 'Tombossa B Foundation | Team' },
  { path: '/volunteer',                         title: 'Tombossa B Foundation | Volunteer' },
  { path: '/events/coffee-women-empowerment-1', title: 'Tombossa B Foundation | Events | Coffee & Women Empowerment' },
  { path: '/events/community-field-day-2025',   title: 'Tombossa B Foundation | Events | Community Field Day' },
];

// The clean URL "/about" and the exported file "/about.html" must both resolve —
// this is exactly the mapping the backend HtmlController provides in production.
const htmlPath = (route) => (route === '/' ? '/index.html' : `${route}.html`);

let server, origin, browser;

before(async () => {
  assert.ok(existsSync(OUT_DIR), 'frontend/out missing — run "npm run build && npm run export" first');
  ({ server, origin } = await startServer(OUT_DIR, 0));
  browser = await chromium.launch();
});

after(async () => {
  await browser?.close();
  server?.close();
});

async function openPage(route) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  await blockExternal(page, origin);
  await page.goto(`${origin}${route}`, { waitUntil: 'load', timeout: 30000 });
  return { ctx, page };
}

for (const route of ROUTES) {
  test(`${route.path}: serves via clean URL and .html, with shared page chrome`, async () => {
    // Both access paths resolve (mirrors HtmlController's clean-URL mapping).
    const clean = await fetch(`${origin}${route.path}`);
    assert.equal(clean.status, 200, `clean URL ${route.path} should serve 200`);
    const asFile = await fetch(`${origin}${htmlPath(route.path)}`);
    assert.equal(asFile.status, 200, `${htmlPath(route.path)} should serve 200`);

    const { ctx, page } = await openPage(route.path);
    try {
      assert.equal(await page.title(), route.title, 'page <title> mismatch');
      // The naming convention itself: home is bare, everything else is prefixed.
      if (route.home) {
        assert.equal(await page.title(), 'Tombossa B Foundation');
      } else {
        assert.ok((await page.title()).startsWith('Tombossa B Foundation | '), 'inner pages must be "Tombossa B Foundation | ..."');
      }

      // Shared chrome present exactly once (NavOne + Footer), plus a donate CTA.
      assert.equal(await page.locator('.header-area').count(), 1, 'NavOne header must be present');
      assert.equal(await page.locator('.footer-area').count(), 1, 'Footer must be present');
      assert.ok(await page.locator('.donate-btn').count() >= 1, 'a donate CTA must be present');

      // Required <head> meta (Layout.js). Responsive + SEO description ship on every page.
      assert.equal(await page.locator('meta[name="viewport"]').count(), 1, 'viewport meta required');
      assert.equal(await page.locator('meta[name="description"]').count(), 1, 'description meta required');

      // Every page except home carries the PageHeader breadcrumb banner.
      if (!route.home) {
        const banner = page.locator('.breadcrumb__title');
        assert.equal(await banner.count(), 1, 'inner pages must render a PageHeader banner');
        assert.ok((await banner.innerText()).trim().length > 0, 'banner title must not be blank');
      }
    } finally {
      await ctx.close();
    }
  });
}

// Coverage guard: if a new top-level page is exported, it must have a ROUTES entry
// above (so it gets the checks). Excludes Next's error pages, which have no chrome.
test('every exported top-level page is covered by ROUTES', async () => {
  const known = new Set(ROUTES.map((r) => (r.path === '/' ? 'index' : r.path.replace(/^\//, ''))));
  const ignore = new Set(['404']); // Next's framework 404, no NavOne/Footer
  const files = await readdir(OUT_DIR);
  const uncovered = files
    .filter((f) => f.endsWith('.html'))
    .map((f) => f.replace(/\.html$/, ''))
    .filter((name) => !known.has(name) && !ignore.has(name));
  assert.deepEqual(uncovered, [], `exported pages with no ROUTES entry (add them): ${uncovered.join(', ')}`);
});

// A miss must 404, not fall through to some page — guards the server/route contract.
test('an unknown route returns 404', async () => {
  const res = await fetch(`${origin}/this-page-does-not-exist`);
  assert.equal(res.status, 404);
});
