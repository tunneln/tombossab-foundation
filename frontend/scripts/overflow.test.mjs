// No page may be wider than a phone screen.
//
// Horizontal overflow is a recurring regression here (a breadcrumb once, then
// long email addresses and a hard-coded 310px min-width). On iPhones it lets
// Safari pan sideways and leaves dead white space beside fixed overlays like the
// donate modal, so it's checked in WebKit (Safari's engine) as well as Chromium,
// on every prerendered page (read from the build manifest, so new pages are
// covered automatically) at common phone widths.
//
// Prereq: build first, then run:
//   npm run build
//   node --test scripts/overflow.test.mjs      (or: npm test)
import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { chromium, webkit, devices } from 'playwright';
import { FRONTEND_DIR, startServer } from './next-server.mjs';

const WIDTHS = [320, 360, 390, 430];
const FONT_HOSTS = /^https:\/\/fonts\.(googleapis|gstatic)\.com\//;
const NOT_PAGES = new Set(['/_not-found', '/sitemap.xml', '/robots.txt']);
const ROUTES = Object.keys(JSON.parse(
    readFileSync(path.join(FRONTEND_DIR, '.next', 'prerender-manifest.json'), 'utf8')).routes)
    .filter((route) => !NOT_PAGES.has(route))
    .sort();

let stop, origin;

before(async () => {
    ({ stop, origin } = await startServer());
});

after(() => stop?.());

// [scrollWidth, clientWidth] of `route` once its layout is settled. Readiness
// is checked directly (document parsed, the site's own stylesheets applied,
// eager images settled, then the fonts they request loaded) instead of via the
// 'load' event: under Playwright, WebKit occasionally never fires 'load' for a
// page with nothing pending, a driver quirk rather than a site bug. One retry
// covers a stalled navigation; a real overflow is never retried away.
async function measure(ctx, route, attempt = 1) {
    const page = await ctx.newPage();
    try {
        // Unlike the other suites, let the site's web fonts load: overflow is
        // about text width, and the narrower fallback font hides real overflow
        // (long email addresses fit in it). Everything else third-party is
        // blocked. Without network the fonts fall back and the check still runs.
        await page.route('**', (r) => {
            const url = r.request().url();
            return url.startsWith(origin) || FONT_HOSTS.test(url) ? r.continue() : r.abort();
        });
        await page.goto(`${origin}${route}`, { waitUntil: 'commit', timeout: 20000 });
        await page.waitForFunction(() => document.readyState !== 'loading'
            && [...document.querySelectorAll('link[rel="stylesheet"]')]
                .every((l) => !l.href.startsWith(location.origin) || l.sheet)
            && [...document.images].every((img) => img.loading === 'lazy' || img.complete),
        null, { timeout: 15000 });
        await page.evaluate(() => document.fonts.ready); // fonts are requested once styles apply
        return await page.evaluate(() =>
            [document.documentElement.scrollWidth, document.documentElement.clientWidth]);
    } catch (err) {
        if (attempt > 1 || err.name !== 'TimeoutError') throw err;
        return measure(ctx, route, attempt + 1);
    } finally {
        await page.close();
    }
}

for (const [engineName, engine] of [['chromium', chromium], ['webkit', webkit]]) {
    test(`${engineName}: no page overflows a phone screen horizontally`, async () => {
        const offenders = [];
        // A fresh browser per width keeps any driver state from carrying over.
        for (const width of WIDTHS) {
            const browser = await engine.launch();
            try {
                const ctx = await browser.newContext({
                    viewport: { width, height: 800 },
                    isMobile: true,
                    hasTouch: true,
                    userAgent: devices['iPhone 13'].userAgent,
                });
                for (const route of ROUTES) {
                    const [scrollW, clientW] = await measure(ctx, route);
                    if (scrollW > clientW) offenders.push(`${route} @${width}px: ${scrollW}px wide`);
                }
            } finally {
                await browser.close();
            }
        }
        assert.deepEqual(offenders, [], `pages wider than the screen:\n  ${offenders.join('\n  ')}`);
    });
}
