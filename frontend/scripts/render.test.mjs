// Per-route health checks for the production build.
//
// For every page the site ships, this asserts the "shell" every route must have:
// it serves at its clean URL, carries the right <title>, declares the document
// language, and renders the shared chrome (nav, footer, a donate CTA, the
// required meta tags). It also fails if a NEW page is prerendered without a
// matching entry here, so route coverage can't silently rot. (/sitemap.xml and
// /robots.txt aren't pages; scripts/gala-render.test.mjs covers them.)
//
// Prereq: build first (no API_BASE_URL -> hermetic fixture content), then run:
//   npm run build
//   node --test scripts/render.test.mjs      (or: npm test)
import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { FRONTEND_DIR, startServer, openPage, blockExternal } from './next-server.mjs';
import { getGalaState } from '../lib/gala.js';

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
  // The gala page opens on its own hero instead of the PageHeader banner.
  { path: '/gala',                              title: 'Tombossa B Foundation | Gala 2026 | Tickets & Sponsorship', noBanner: true },
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

      // The gold gala button in the header, on every page (it jumps to the
      // ticket section on /gala itself). Its label follows the gala state the
      // browser computes today; after the event it's gone. The page first shows
      // the build-time default, so wait until it has switched to today's state.
      const galaState = getGalaState(new Date());
      await page.waitForFunction((s) => document.documentElement.dataset.galaState === s, galaState);
      const galaHref = route.path === '/gala' ? '#tickets' : '/gala';
      const galaButtons = page.locator(`header a[href="${galaHref}"]`);
      if (galaState === 'past') {
        assert.equal(await galaButtons.count(), 0, 'header gala button must be gone after the event');
      } else {
        const label = galaState === 'online_closed' ? 'The Gala' : 'Gala Tickets';
        assert.ok(await galaButtons.filter({ hasText: label }).count() >= 1, `header "${label}" button must be present`);
      }

      // Required <head> meta. Responsive + SEO description ship on every page.
      assert.equal(await page.locator('meta[name="viewport"]').count(), 1, 'viewport meta required');
      assert.equal(await page.locator('meta[name="description"]').count(), 1, 'description meta required');

      // Every page except home carries the PageHeader breadcrumb banner.
      if (!route.home && !route.noBanner) {
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

test('/events/gala-2026 permanently redirects to the canonical /gala', async () => {
  const res = await fetch(`${origin}/events/gala-2026`, { redirect: 'manual' });
  assert.equal(res.status, 308);
  assert.equal(res.headers.get('location'), '/gala');
});

// The old site served every page at its .html file name too; those links must
// keep working after the cutover.
test('legacy .html URLs permanently redirect to the clean URL', async () => {
  for (const [legacy, clean] of [
    ['/about.html', '/about'],
    ['/index.html', '/'],
    ['/events/coffee-women-empowerment-1.html', '/events/coffee-women-empowerment-1'],
  ]) {
    const res = await fetch(`${origin}${legacy}`, { redirect: 'manual' });
    assert.equal(res.status, 308, `${legacy} should permanently redirect`);
    assert.equal(res.headers.get('location'), clean, `${legacy} redirect target`);
  }
});

// The full desktop header (contact bar + nav, > 1366px and wider than 4:3) is
// the compact 32px + 96px version, and the homepage hero still fills the
// screen exactly below it. The hamburger header (everywhere else) is 108px,
// leaving the logo room above and below it, or 96px on short screens (phones
// turned sideways), with the hero pulled up under it to start at the very top.
test('headers are compact (desktop 32px + 96px, hamburger 108px, 96px when short) and the hero fills the screen', async () => {
  const measure = async (width, height, mobile = false) => {
    const ctx = await browser.newContext({ viewport: { width, height }, isMobile: mobile, hasTouch: mobile });
    try {
      const page = await ctx.newPage();
      await blockExternal(page, origin);
      await page.goto(`${origin}/`, { waitUntil: 'load', timeout: 30000 });
      await page.waitForFunction(() => document.documentElement.dataset.galaState);
      return await page.evaluate(() => {
        const box = (sel) => document.querySelector(sel)?.getBoundingClientRect();
        const donate = box('.header-area .header-btn .donate-btn');
        const pill = box('header a[class*="GalaNavButton_desktop"]');
        const logo = [...document.querySelectorAll('.brand-logo img')].find((i) => i.offsetParent)?.getBoundingClientRect();
        const burger = box('.mobile-menu-toggle i');
        return {
          contactBar: box('.header-top-action').height,
          nav: box('.header-top').height,
          logoMid: logo.top + logo.height / 2,
          burgerMid: burger && burger.height ? burger.top + burger.height / 2 : null,
          heroTop: box('.single-slide-item').top,
          heroBottom: box('.single-slide-item').bottom,
          donate: donate?.height,
          pill: pill?.height ?? null,
        };
      });
    } finally {
      await ctx.close();
    }
  };
  for (const [width, height] of [[1440, 900], [1920, 1080]]) {
    const m = await measure(width, height);
    assert.equal(m.contactBar, 32, `${width}px: contact bar`);
    assert.equal(m.nav, 96, `${width}px: nav bar`);
    assert.equal(Math.round(m.heroBottom), height, `${width}px: the hero ends at the bottom of the screen`);
    assert.equal(m.donate, 46, `${width}px: header Donate button`);
    if (m.pill !== null) assert.equal(m.pill, m.donate, `${width}px: Gala Tickets matches Donate`);
  }
  for (const [width, height, mobile, nav] of [[1366, 768, false, 108], [1024, 768, true, 108], [390, 844, true, 108], [844, 390, true, 96]]) {
    const m = await measure(width, height, mobile);
    assert.equal(m.nav, nav, `${width}x${height}: hamburger header`);
    assert.ok(Math.abs(m.burgerMid - m.logoMid) <= 1, `${width}px: menu icon level with the logo (${m.burgerMid} vs ${m.logoMid})`);
    assert.equal(Math.round(m.heroTop), 0, `${width}px: the hero starts at the top, under the header`);
    assert.equal(Math.round(m.heroBottom), height, `${width}px: the hero fills the screen`);
  }
});

// The nav is white (white logo + white hamburger) only at the top of the home
// page, over the dark hero; dark on other pages and once scrolled. Checked in
// the served HTML (what shows before JavaScript, and what hydration keeps) and
// live, through scrolling and client-side navigation both ways.
test('the nav is white only at the top of the home page', async () => {
  const WHITE = { logo: '/images/logo-white.svg', whiteBars: true };
  const DARK = { logo: '/images/logo-black.svg', whiteBars: false };
  const served = async (route) => {
    const html = await (await fetch(`${origin}${route}`)).text();
    return { logo: html.match(/<img id="site-logo" src="([^"]+)"/)?.[1], whiteBars: /class="fa fa-bars[^"]*white-nav-bar/.test(html) };
  };
  assert.deepEqual(await served('/'), WHITE, 'home page HTML');
  for (const route of ['/about', '/gala', '/events/community-field-day-2025']) {
    assert.deepEqual(await served(route), DARK, `${route} HTML`);
  }

  const { ctx, page } = await openPage(browser, origin, '/');
  try {
    await page.setViewportSize({ width: 390, height: 844 }); // hamburger layout: logo and icon sit on the hero
    await page.waitForFunction(() => document.documentElement.dataset.galaState); // hydrated
    const nav = () => page.evaluate(() => {
      const bars = document.querySelector('.mobile-menu-toggle i');
      return { logo: document.getElementById('site-logo').getAttribute('src'), whiteBars: getComputedStyle(bars).color === 'rgb(255, 255, 255)' };
    });
    const until = (want) => page.waitForFunction((src) => document.getElementById('site-logo').getAttribute('src') === src, want.logo);
    // The white and black logos share one layout, so turning dark changes only the color.
    const logoBox = () => page.evaluate(() => { const r = document.getElementById('site-logo').getBoundingClientRect(); return [r.x, r.width, r.height].map((v) => Math.round(v * 10) / 10); });
    assert.deepEqual(await nav(), WHITE, 'top of the home page');
    const whiteBox = await logoBox();
    await page.evaluate(() => window.scrollTo(0, 600));
    await until(DARK);
    assert.deepEqual(await nav(), DARK, 'home page, scrolled');
    await page.waitForFunction(() => document.getElementById('site-logo').complete);
    assert.deepEqual(await logoBox(), whiteBox, 'the logo keeps its size and position when the nav turns dark');
    await page.evaluate(() => window.scrollTo(0, 0));
    await until(WHITE);
    assert.deepEqual(await nav(), WHITE, 'home page, scrolled back to the top');
    await page.evaluate(() => document.querySelector('a[href="/about"]').click());
    await page.waitForURL(`${origin}/about`);
    await until(DARK);
    assert.deepEqual(await nav(), DARK, 'client-side navigation to /about');
    await page.evaluate(() => document.querySelector('.brand-logo a').click());
    await page.waitForURL(`${origin}/`);
    await until(WHITE);
    assert.deepEqual(await nav(), WHITE, 'client-side navigation back home');
  } finally {
    await ctx.close();
  }
});

// The header has one logo image: a desktop visitor downloads only the desktop
// logo (not the hidden menu-layout ones), and the menu layout only its own.
test('each header layout downloads only the logo it shows', async () => {
  for (const [width, height, want] of [[1440, 900, ['logo.svg']], [390, 844, ['logo-white.svg']]]) {
    const ctx = await browser.newContext({ viewport: { width, height } });
    try {
      const page = await ctx.newPage();
      await blockExternal(page, origin);
      const logos = [];
      page.on('request', (r) => { const m = r.url().match(/\/images\/(logo(?:-white|-black)?\.svg)/); if (m) logos.push(m[1]); });
      await page.goto(`${origin}/`, { waitUntil: 'load', timeout: 30000 });
      assert.deepEqual([...new Set(logos)], want, `${width}x${height}`);
    } finally {
      await ctx.close();
    }
  }
});

// Regression guard for a production-only bug: Vercel regenerates the home page
// (ISR) as "/index", so a home-page check on usePathname() rendered the wrong
// HTML there (a dark nav that hydration left dark) while local runs, which see
// "/", passed. Routes must be read through lib/route-path.js, which maps
// "/index" back to "/"; this can't be reproduced locally, so pin it.
test('the current route is read only through lib/route-path.js', () => {
  const offenders = [];
  const walk = (dir) => {
    for (const entry of readdirSync(path.join(FRONTEND_DIR, dir), { withFileTypes: true })) {
      const rel = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(rel);
      else if (/\.(m?js|jsx|tsx?)$/.test(entry.name) && rel !== path.join('lib', 'route-path.js')
        && /\busePathname\b/.test(readFileSync(path.join(FRONTEND_DIR, rel), 'utf8'))) offenders.push(rel);
    }
  };
  ['app', 'components', 'lib', 'config'].forEach(walk);
  assert.deepEqual(offenders, [], `use useRoutePath() from lib/route-path.js instead of usePathname() in: ${offenders.join(', ')}`);
});

// The page-title banner stays compact on every screen, and on phones its title
// stays clear of the fixed Donate tab (/apply has a two-line title there).
test('the page-title banner is compact and clear of the Donate tab', async () => {
  const { ctx, page } = await openPage(browser, origin, '/apply');
  try {
    for (const [width, height, maxBanner] of [[1440, 900, 180], [1366, 768, 180], [768, 1024, 160], [390, 844, 170], [360, 780, 170], [320, 568, 170]]) {
      await page.setViewportSize({ width, height });
      const m = await page.evaluate(() => {
        const banner = document.querySelector('.breadcrumb-area').getBoundingClientRect();
        const tab = [...document.querySelectorAll('a.donate-floating')].map((e) => e.getBoundingClientRect()).find((r) => r.width > 0);
        const range = document.createRange();
        range.selectNodeContents(document.querySelector('.breadcrumb__title'));
        const hit = !!tab && [...range.getClientRects()].some((l) => l.left < tab.right && l.right > tab.left && l.top < tab.bottom && l.bottom > tab.top);
        return { height: banner.height, hit };
      });
      assert.ok(m.height <= maxBanner, `${width}x${height}: banner is ${m.height}px (max ${maxBanner})`);
      assert.equal(m.hit, false, `${width}x${height}: the title runs under the Donate tab`);
    }
  } finally {
    await ctx.close();
  }
});

// Phones and tablets: the side tab (red Donate; gold Gala Tickets on /gala while
// tickets sell) hugs the right edge with a 44px-deep touch target. On pages with
// a title card it starts 10px below the card (one- or two-line title) and ends
// above whatever opens the page, heading or photo, unless the card nearly fills a
// short screen, where it stops 10px above the bottom instead; elsewhere its top
// is 10px below the header, also while the header scrolls away, and once
// scrolled it rides 10px below the header. It hides while the side menu is open
// and stays hidden until the menu has slid out.
test('the side tab sits just below the page-title card, then just below the header', async () => {
  const { ctx, page } = await openPage(browser, origin, '/');
  const measure = () => page.evaluate(() => {
    const tabs = [...document.querySelectorAll('a.donate-floating, a[class*="GalaNavButton_floating"]')].filter((e) => e.getBoundingClientRect().width > 0);
    const tab = tabs[0]?.getBoundingClientRect();
    const banner = document.querySelector('.breadcrumb-area')?.getBoundingClientRect();
    const below = banner && [...document.querySelectorAll('h1, h2, h3, img, iframe')]
      .filter((e) => !e.closest('header, .breadcrumb-area, .donate-tab-anchor, footer') && e.getBoundingClientRect().height > 0)
      .map((e) => e.getBoundingClientRect().top).filter((t) => t >= banner.bottom);
    return {
      count: tabs.length, tab, vw: document.documentElement.clientWidth,
      header: document.querySelector('.header-area .header-top').getBoundingClientRect().bottom,
      banner: banner?.bottom, firstBelow: below && Math.min(...below),
      hidden: tabs[0] && getComputedStyle(tabs[0]).visibility === 'hidden',
      canScroll: document.documentElement.scrollHeight - innerHeight > 150,
      vh: innerHeight,
      // A tap 40px in from the screen edge, halfway along the tab, lands on it.
      touch: tab && tabs[0].contains(document.elementFromPoint(document.documentElement.clientWidth - 40, (tab.top + tab.bottom) / 2)),
    };
  });
  const check = async (route, width, height, { menu = false } = {}) => {
    const at = `${width}x${height} ${route}`;
    await page.setViewportSize({ width, height });
    await page.goto(`${origin}${route}`, { waitUntil: 'load' });
    let m = await measure();
    assert.equal(m.count, 1, `${at}: one side tab`);
    assert.ok(Math.abs(m.tab.right - m.vw) < 1, `${at}: on the right edge (${m.tab.right} vs ${m.vw})`);
    assert.ok(m.touch, `${at}: 44px-deep touch target`);
    assert.ok(m.tab.bottom <= m.vh, `${at}: fully on screen (${m.tab.bottom} vs ${m.vh})`);
    if (m.banner != null && m.banner > m.vh - 95) {
      // The holder's sticky `bottom: 95px` (style.css) caught it: card bottom past vh - 95.
      assert.ok(Math.abs(m.tab.top - (m.vh - 85)) < 1, `${at}: tall card on a short screen, held up from the bottom (${m.tab.top} vs ${m.vh})`);
    } else if (m.banner != null) {
      assert.ok(Math.abs(m.tab.top - m.banner - 10) < 1, `${at}: starts 10px below the title card (${m.tab.top} vs ${m.banner})`);
      assert.ok(m.tab.bottom < m.firstBelow, `${at}: ends above the first heading or photo (${m.tab.bottom} vs ${m.firstBelow})`);
    } else {
      assert.ok(Math.abs(m.tab.top - m.header - 10) < 1, `${at}: starts 10px below the header (${m.tab.top} vs ${m.header})`);
      if (m.canScroll) {
        await page.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; window.scrollTo(0, 60); });
        const s = await measure();
        assert.ok(Math.abs(s.tab.top - s.header - 10) < 1, `${at}: moves with the header as it scrolls away (${s.tab.top} vs ${s.header})`);
      }
    }
    if (m.canScroll) {
      await page.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; window.scrollTo(0, Math.min(900, document.documentElement.scrollHeight - innerHeight)); });
      await page.waitForSelector('.header-top.header-fixed');
      m = await measure();
      assert.ok(Math.abs(m.tab.top - m.header - 10) < 1, `${at}: scrolled, 10px below the header (${m.tab.top} vs ${m.header})`);
    }
    if (menu) {
      await page.click('.mobile-menu-toggle');
      await page.waitForSelector('.side-nav-container.active');
      assert.equal((await measure()).hidden, true, `${at}: hidden while the side menu is open`);
      await page.click('.side-menu-close');
      await page.waitForSelector('.side-nav-container.active', { state: 'detached' });
      assert.equal((await measure()).hidden, true, `${at}: still hidden while the menu slides out`);
      await page.waitForTimeout(600);
      assert.equal((await measure()).hidden, false, `${at}: back once the menu is gone`);
    }
  };
  try {
    const sitemap = await (await fetch(`${origin}/sitemap.xml`)).text();
    const routes = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((loc) => new URL(loc[1]).pathname);
    for (const route of routes) await check(route, 390, 844);
    for (const route of routes) await check(route, 568, 320);
    for (const [width, height] of [[360, 780], [768, 1024], [1024, 768], [844, 390]]) {
      for (const route of ['/apply', '/about', '/', '/gala']) await check(route, width, height, { menu: true });
    }
  } finally {
    await ctx.close();
  }
});

// The scholars slide shows the art made for the screen's shape, sized to cover.
test('the scholars slide uses the art for the screen shape, sized to cover', async () => {
  const { ctx, page } = await openPage(browser, origin, '/');
  try {
    for (const [width, height, image, size] of [
      [1920, 1080, 'slider3.jpg', '1920px'],
      [1366, 768, 'slider3-tablet.jpg', 'cover'],
      [1024, 768, 'slider3-tablet.jpg', 'cover'],
      [844, 390, 'slider3-tablet.jpg', 'cover'],
      [1024, 1366, 'slider3-mobile.jpg', 'cover'],
      [390, 844, 'slider3-mobile.jpg', 'cover'],
      [320, 568, 'slider3-mobile.jpg', 'cover'],
    ]) {
      await page.setViewportSize({ width, height });
      const bg = await page.evaluate(() => {
        const cs = getComputedStyle(document.querySelector('.slide-bg3'));
        return { image: cs.backgroundImage.match(/images\/([^")]+)/)?.[1], size: cs.backgroundSize };
      });
      assert.deepEqual(bg, { image, size }, `${width}x${height}`);
    }
  } finally {
    await ctx.close();
  }
});

// Every page's link-preview image must actually work when shared: it loads, is
// served as the image type its name says, and stays small (WhatsApp drops
// preview images over ~300 KB, so keep a safe margin).
test('every page has a link-preview image that loads, has the right type, and stays under 250 KB', async () => {
  const checked = new Map();
  for (const route of ROUTES) {
    const html = await (await fetch(`${origin}${route.path}`)).text();
    const url = html.match(/<meta property="og:image" content="([^"]+)"/)?.[1];
    assert.ok(url, `${route.path} must have an og:image`);
    if (!checked.has(url)) {
      const res = await fetch(url.replace('https://tombossabfoundation.org', origin));
      checked.set(url, { status: res.status, type: res.headers.get('content-type') || '', bytes: (await res.arrayBuffer()).byteLength });
    }
    const img = checked.get(url);
    assert.equal(img.status, 200, `${route.path}: ${url} must load`);
    const expected = url.endsWith('.jpg') ? 'image/jpeg' : url.endsWith('.png') ? 'image/png' : null;
    assert.ok(expected && img.type.startsWith(expected), `${route.path}: ${url} is served as "${img.type}"`);
    assert.ok(img.bytes < 250_000, `${route.path}: ${url} is ${img.bytes} bytes; keep it under 250 KB for WhatsApp previews`);
  }
});

// Coverage guard: every prerendered route must have a ROUTES entry above (so it
// gets the checks). Reads the build's own manifest, so a new page can't ship
// unchecked. Excludes Next's framework not-found route.
test('every prerendered route is covered by ROUTES', () => {
  const manifest = JSON.parse(
    readFileSync(path.join(FRONTEND_DIR, '.next', 'prerender-manifest.json'), 'utf8'));
  const known = new Set(ROUTES.map((r) => r.path));
  const ignore = new Set(['/_not-found', '/sitemap.xml', '/robots.txt']);
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
