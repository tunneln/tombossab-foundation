// Link-graph and content-ordering checks for the static export.
//
// Three things that break silently in a static site: an internal link pointing at
// a route that no longer exports (dead link), an external link missing its
// security rel (tab-nabbing / referrer leak), and a data-driven list rendering in
// the wrong order after a sort regression. This covers all three end-to-end
// against the real exported HTML.
//
// Prereq: build the export first, then run:
//   npm run build && npm run export
//   node --test scripts/links.test.mjs      (or: npm test)
import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { OUT_DIR, startServer, blockExternal, resolveFile } from './serve-out.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(__dirname, '../data');
const readJson = (name) => JSON.parse(readFileSync(path.join(DATA_DIR, name), 'utf8'));

// Broad crawl set — enough coverage to catch a dead link anywhere in the shared
// nav/footer as well as page-specific links.
const PAGES = [
  '/', '/about', '/apply', '/award-recipients', '/causes', '/contact',
  '/donatenow', '/events', '/gallery', '/newsletters', '/team', '/volunteer',
  '/events/coffee-women-empowerment-1', '/events/community-field-day-2025',
];

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

// Every site-internal <a href="/..."> must resolve to a real exported file (page
// or asset). "#" anchors and mailto:/tel:/external links are out of scope here.
test('no dead internal links on any core page', async () => {
  const dead = [];
  for (const route of PAGES) {
    const { ctx, page } = await openPage(route);
    const hrefs = await page.$$eval('a[href^="/"]', (els) =>
      [...new Set(els.map((a) => a.getAttribute('href')))]);
    await ctx.close();
    for (const href of hrefs) {
      const bare = href.split('#')[0].split('?')[0];
      if (bare === '' || resolveFile(bare)) continue;
      dead.push(`${route} -> ${href}`);
    }
  }
  assert.deepEqual(dead, [], `dead internal links:\n  ${dead.join('\n  ')}`);
});

// Convention (components/CLAUDE.md): external links always open in a new tab AND
// carry rel="noopener noreferrer". A target="_blank" without noopener is a known
// security foot-gun, so pin it.
test('every target="_blank" link carries rel="noopener"', async () => {
  const offenders = [];
  for (const route of PAGES) {
    const { ctx, page } = await openPage(route);
    const bad = await page.$$eval('a[target="_blank"]', (els) =>
      els.filter((a) => !(a.getAttribute('rel') || '').includes('noopener'))
         .map((a) => a.getAttribute('href')));
    await ctx.close();
    bad.forEach((href) => offenders.push(`${route} -> ${href}`));
  }
  assert.deepEqual(offenders, [], `_blank links missing rel="noopener":\n  ${offenders.join('\n  ')}`);
});

// Data-driven ORDER (the outcome of the page's getStaticProps sort), checked
// against the source data independently of how the page sorts — so it catches a
// sort regression without merely re-implementing the comparator.
test('/award-recipients renders recipients newest-year first', async () => {
  const yearByName = new Map(readJson('recipients.json').map((r) => [r.name, Number(r.year)]));
  const { ctx, page } = await openPage('/award-recipients');
  const names = await page.$$eval('.team-area h3', (els) =>
    els.map((h) => h.textContent.split(':')[0].trim()));
  await ctx.close();

  assert.equal(names.length, yearByName.size, 'every recipient should render exactly once');
  const years = names.map((n) => {
    assert.ok(yearByName.has(n), `rendered recipient "${n}" not found in recipients.json`);
    return yearByName.get(n);
  });
  for (let i = 1; i < years.length; i++) {
    assert.ok(years[i - 1] >= years[i], `recipients not in year-desc order: ${names} -> ${years}`);
  }
});

test('/newsletters renders issues newest-date first, and each PDF link resolves', async () => {
  const dateByHeadline = new Map(readJson('newsletters.json').map((n) => [n.headline, n.date]));
  const { ctx, page } = await openPage('/newsletters');
  const headlines = await page.$$eval('.news__content-title a', (els) => els.map((a) => a.textContent.trim()));
  const pdfs = await page.$$eval('a[href$=".pdf"]', (els) => [...new Set(els.map((a) => a.getAttribute('href')))]);
  await ctx.close();

  assert.equal(headlines.length, dateByHeadline.size, 'every newsletter should render exactly once');
  const dates = headlines.map((h) => {
    assert.ok(dateByHeadline.has(h), `rendered headline "${h}" not found in newsletters.json`);
    return dateByHeadline.get(h);
  });
  for (let i = 1; i < dates.length; i++) {
    assert.ok(dates[i - 1] >= dates[i], `newsletters not in date-desc order: ${dates}`);
  }

  assert.ok(pdfs.length > 0, 'expected newsletter PDF links');
  for (const href of pdfs) {
    assert.ok(resolveFile(href.split('?')[0]), `newsletter PDF link points at a missing file: ${href}`);
  }
});
