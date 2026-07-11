// Per-route health checks for the production build.
//
// For every page the site ships, this asserts the "shell" every route must have:
// it serves at its clean URL, carries the right <title>, declares the document
// language, and renders the shared chrome (nav, footer, a donate CTA, the
// required meta tags). It also fails if a NEW page is prerendered without a
// matching entry here, so route coverage can't silently rot.
//
// Prereq: build first (no API_BASE_URL -> hermetic fixture content), then run:
//   npm run build
//   node --test scripts/render.test.mjs      (or: npm test)
import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { FRONTEND_DIR, startServer, openPage } from './next-server.mjs';

// The full set of user-facing routes and their exact titles. Home is bare; every
// other page follows the "Tombossa B Foundation | X" convention (app/CLAUDE.md).
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

let stop, origin, browser;

before(async () => {
  ({ stop, origin } = await startServer());
  browser = await chromium.launch();
});

after(async () => {
  await browser?.close();
  stop?.();
});

for (const route of ROUTES) {
  test(`${route.path}: serves via clean URL, with shared page chrome`, async () => {
    const clean = await fetch(`${origin}${route.path}`);
    assert.equal(clean.status, 200, `clean URL ${route.path} should serve 200`);

    const { ctx, page } = await openPage(browser, origin, route.path);
    try {
      assert.equal(await page.title(), route.title, 'page <title> mismatch');
      // The naming convention itself: home is bare, everything else is prefixed.
      if (route.home) {
        assert.equal(await page.title(), 'Tombossa B Foundation');
      } else {
        assert.ok((await page.title()).startsWith('Tombossa B Foundation | '), 'inner pages must be "Tombossa B Foundation | ..."');
      }

      // The document declares its language (accessibility contract).
      assert.equal(await page.locator('html').getAttribute('lang'), 'en', 'html[lang] must be "en"');

      // Shared chrome present exactly once (NavOne + Footer), plus a donate CTA.
      assert.equal(await page.locator('.header-area').count(), 1, 'NavOne header must be present');
      assert.equal(await page.locator('.footer-area').count(), 1, 'Footer must be present');
      assert.ok(await page.locator('.donate-btn').count() >= 1, 'a donate CTA must be present');

      // Required <head> meta. Responsive + SEO description ship on every page.
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

// The legacy URLs the old backend 301'd must keep redirecting (next.config.mjs).
// Next emits 308 (the modern permanent-redirect status).
test('legacy event URLs permanently redirect to the event page', async () => {
  for (const legacy of ['/coffee-women-empowerment', '/events-detail']) {
    const res = await fetch(`${origin}${legacy}`, { redirect: 'manual' });
    assert.equal(res.status, 308, `${legacy} should permanently redirect`);
    assert.equal(res.headers.get('location'), '/events/coffee-women-empowerment-1', `${legacy} redirect target`);
  }
});

// Coverage guard: every prerendered route must have a ROUTES entry above (so it
// gets the checks). Reads the build's own manifest, so a new page can't ship
// unchecked. Excludes Next's framework not-found route.
test('every prerendered route is covered by ROUTES', () => {
  const manifest = JSON.parse(
    readFileSync(path.join(FRONTEND_DIR, '.next', 'prerender-manifest.json'), 'utf8'));
  const known = new Set(ROUTES.map((r) => r.path));
  const ignore = new Set(['/_not-found']);
  const uncovered = Object.keys(manifest.routes)
    .filter((route) => !known.has(route) && !ignore.has(route))
    .sort();
  assert.deepEqual(uncovered, [], `prerendered routes with no ROUTES entry (add them): ${uncovered.join(', ')}`);
});

// A miss must 404 (App Router serves not-found.js with a real 404 status).
test('an unknown route returns 404', async () => {
  const res = await fetch(`${origin}/this-page-does-not-exist`);
  assert.equal(res.status, 404);
});
