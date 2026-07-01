// Asset regression tests for the static export — guards the site-wide image
// recompress (q85) and the entry-video PNG->JPEG swap from silently regressing.
//
// Prereq: build the export first, then run the tests:
//   npm run build && npm run export
//   node --test scripts/images.test.mjs      (or: npm test)
import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { OUT_DIR, startServer, blockExternal } from './serve-out.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.resolve(__dirname, '../public');

// Pages that render the recompressed photos (one per affected section).
const PAGES = ['/', '/about', '/causes', '/events', '/award-recipients', '/team', '/apply', '/contact'];

// Non-gallery site images should stay lean. Gallery originals are intentionally
// large (handled separately) so they're excluded from the budget.
const MAX_IMAGE_BYTES = 1024 * 1024; // 1 MB
const isImage = (name) => /\.(jpe?g|png)$/i.test(name);
const isGallery = (name) => name.startsWith('gallery-img');

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

// Open a route with external requests blocked (offline + deterministic), same as the harness.
async function openPage(route) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  await blockExternal(page, origin);
  await page.goto(`${origin}${route}`, { waitUntil: 'load', timeout: 30000 });
  return { ctx, page };
}

test('every local <img> on core pages actually decodes (no broken images)', async () => {
  for (const route of PAGES) {
    const { ctx, page } = await openPage(route);
    // Only site-local assets (src="/..."); external images (e.g. the Donorbox
    // logo) are intentionally blocked by the offline route handler above.
    const broken = await page.$$eval('img', (imgs) =>
      imgs
        .filter((img) => img.getAttribute('src')?.startsWith('/') && (!img.complete || img.naturalWidth === 0))
        .map((img) => img.getAttribute('src')));
    await ctx.close();
    assert.deepEqual(broken, [], `broken images on ${route}: ${broken.join(', ')}`);
  }
});

test('entry-video uses the recompressed JPEG; the old PNG is gone', async () => {
  const { ctx, page } = await openPage('/');
  const src = await page.getAttribute('.entry-video-img img', 'src');
  await ctx.close();
  assert.equal(src, '/images/entry-video-img.jpg', 'EntryArea should point at the .jpg');

  const png = await fetch(`${origin}/images/entry-video-img.png`);
  assert.equal(png.status, 404, 'the 1.6MB PNG should no longer be exported');
  const jpg = await fetch(`${origin}/images/entry-video-img.jpg`);
  assert.equal(jpg.status, 200, 'the recompressed JPEG should be served');
});

test('no non-gallery image exceeds the 1 MB budget', async () => {
  const tooBig = [];
  async function walk(dir, label) {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(full, `${label}${entry.name}/`);
      } else if (isImage(entry.name) && !isGallery(entry.name)) {
        const { size } = await stat(full);
        if (size > MAX_IMAGE_BYTES) tooBig.push(`${label}${entry.name} (${Math.round(size / 1024)}KB)`);
      }
    }
  }
  await walk(PUBLIC_DIR, '');
  assert.deepEqual(tooBig, [], `images over 1 MB: ${tooBig.join(', ')}`);
});
