// Regression tests for the self-hosted donate modal (replaces Donorbox's
// desktop-only widget.js popup, which opened /donatenow in a NEW TAB on
// mobile/tablet instead of showing a modal).
//
// Offline by design: the route handler aborts external requests, so the
// Donorbox embed never actually loads — but the <iframe> element (with its
// src) is still created, which is all these assertions need.
//
// Prereq: npm run build && npm run export   (then: node --test scripts/donate.test.mjs, or npm test)
import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { chromium } from 'playwright';
import { OUT_DIR, startServer } from './serve-out.mjs';

// Distinguishes the MODAL embed from the donor-wall embed already on the home page.
const MODAL_EMBED = 'donorbox.org/embed/scholarship-fund-73?language=en-us';
const IPHONE_UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';

const VIEWPORTS = [
  { name: 'desktop', w: 1440, h: 900,  mobile: false },
  { name: 'tablet',  w: 768,  h: 1024, mobile: true },
  { name: 'mobile',  w: 390,  h: 844,  mobile: true },
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

async function openHome(vp) {
  const ctx = await browser.newContext({
    viewport: { width: vp.w, height: vp.h },
    isMobile: vp.mobile, hasTouch: vp.mobile,
    userAgent: vp.mobile ? IPHONE_UA : undefined,
  });
  const page = await ctx.newPage();
  const popups = [];
  page.on('popup', (p) => popups.push(p.url()));
  await page.route('**', (r) => (r.request().url().startsWith(origin) ? r.continue() : r.abort()));
  await page.goto(`${origin}/`, { waitUntil: 'load', timeout: 30000 });
  return { ctx, page, popups };
}

// Tap the primary Donate CTA the way a user on this viewport would reach it.
async function tapDonate(page, vp) {
  if (vp.mobile) {
    await page.click('.mobile-menu-toggle');
    await page.waitForTimeout(600); // side menu slide-in
    await page.click('.side-nav-container .donate-btn');
  } else {
    await page.click('.header-btn .donate-btn');
  }
}

// Core fix: every viewport opens an in-page modal, never a new tab or navigation.
for (const vp of VIEWPORTS) {
  test(`${vp.name}: Donate opens an in-page modal — no new tab, no redirect`, async () => {
    const { ctx, page, popups } = await openHome(vp);
    try {
      assert.equal(await page.locator('.donate-modal-overlay').count(), 0, 'modal should start closed');
      // Lazy: the modal's embed iframe must not exist until opened.
      assert.equal(await page.locator(`iframe[src*="${MODAL_EMBED}"]`).count(), 0, 'embed iframe should be lazy');

      const urlBefore = page.url();
      await tapDonate(page, vp);
      await page.waitForTimeout(800);

      assert.equal(await page.locator('.donate-modal-overlay').count(), 1, 'modal should open in-page');
      assert.equal(await page.locator(`iframe[src*="${MODAL_EMBED}"]`).count(), 1, 'embed iframe should mount on open');
      assert.equal(page.url(), urlBefore, 'must NOT navigate away');
      assert.deepEqual(popups, [], 'must NOT open a new tab (the original bug)');
    } finally {
      await ctx.close();
    }
  });
}

// The fixed side tab is the mobile/tablet CTA (hidden on desktop) — it must open the modal there.
for (const vp of VIEWPORTS.filter((v) => v.mobile)) {
  test(`${vp.name}: fixed floating donate tab opens the modal`, async () => {
    const { ctx, page, popups } = await openHome(vp);
    try {
      const urlBefore = page.url();
      await page.click('.donate-floating');
      await page.waitForTimeout(800);
      assert.equal(await page.locator('.donate-modal-overlay').count(), 1, 'floating tab should open modal');
      assert.equal(page.url(), urlBefore, 'must NOT navigate away');
      assert.deepEqual(popups, [], 'must NOT open a new tab');
    } finally {
      await ctx.close();
    }
  });
}

// Responsive CTA: exactly one donate affordance per viewport, mirroring the original.
test('desktop shows the header donate button and hides the floating tab', async () => {
  const { ctx, page } = await openHome(VIEWPORTS[0]); // 1440 (> 1024 breakpoint)
  try {
    assert.equal(await page.locator('.header-btn .donate-btn').isVisible(), true, 'header button visible on desktop');
    assert.equal(await page.locator('.donate-floating').isVisible(), false, 'floating tab hidden on desktop');
  } finally {
    await ctx.close();
  }
});

for (const vp of VIEWPORTS.filter((v) => v.mobile)) {
  test(`${vp.name}: header donate button hidden, floating tab shown`, async () => {
    const { ctx, page } = await openHome(vp);
    try {
      assert.equal(await page.locator('.header-btn .donate-btn').isVisible(), false, 'header button hidden on mobile/tablet');
      assert.equal(await page.locator('.donate-floating').isVisible(), true, 'floating tab visible on mobile/tablet');
    } finally {
      await ctx.close();
    }
  });
}

// Each close mechanism on its own fresh page (isolated — no cross-cycle state).
const CLOSERS = [
  { name: 'X button',      close: (page) => page.click('.donate-modal-close') },
  { name: 'Escape key',    close: (page) => page.keyboard.press('Escape') },
  { name: 'overlay click', close: (page) => page.locator('.donate-modal-overlay').click({ position: { x: 8, y: 8 } }) },
];
for (const { name, close } of CLOSERS) {
  test(`modal closes via ${name}`, async () => {
    const { ctx, page } = await openHome(VIEWPORTS[0]);
    try {
      await page.click('.header-btn .donate-btn');
      await page.waitForTimeout(500);
      assert.equal(await page.locator('.donate-modal-overlay').count(), 1, 'modal should be open');
      await close(page);
      await page.waitForTimeout(300);
      assert.equal(await page.locator('.donate-modal-overlay').count(), 0, `should close via ${name}`);
    } finally {
      await ctx.close();
    }
  });
}

test('Donorbox widget.js / install-popup-button.js are no longer loaded', async () => {
  const { ctx, page } = await openHome(VIEWPORTS[0]);
  try {
    const scripts = await page.$$eval('script', (els) => els.map((s) => s.src).filter(Boolean));
    assert.ok(!scripts.some((s) => s.includes('widget.js')), 'widget.js must not be injected');
    assert.ok(!scripts.some((s) => s.includes('install-popup-button')), 'install-popup-button.js must not be injected');
    assert.equal(await page.evaluate(() => window.DonorBox), undefined, 'window.DonorBox must be unset');
  } finally {
    await ctx.close();
  }
});

test('every donate button keeps the /donatenow fallback href (works without JS)', async () => {
  const { ctx, page } = await openHome(VIEWPORTS[0]);
  try {
    const hrefs = await page.$$eval('.donate-btn', (els) => els.map((e) => e.getAttribute('href')));
    assert.ok(hrefs.length >= 3, `expected several donate buttons, found ${hrefs.length}`);
    assert.ok(hrefs.every((h) => h === '/donatenow'), `all should fall back to /donatenow, got ${JSON.stringify(hrefs)}`);
  } finally {
    await ctx.close();
  }
});

// Layout guard: on a short screen the modal must fit within the viewport (the tall
// form scrolls INSIDE it) — regression test for the iPhone-SE overflow bug.
test('modal fits within a short viewport (iPhone SE) without overflowing the screen', async () => {
  const { ctx, page } = await openHome({ name: 'se', w: 375, h: 667, mobile: true });
  try {
    await page.click('.donate-floating');
    await page.waitForTimeout(800);
    const box = await page.locator('.donate-modal').evaluate((el) => {
      const r = el.getBoundingClientRect();
      return { top: r.top, bottom: r.bottom, height: r.height, vh: window.innerHeight };
    });
    assert.ok(box.height <= box.vh, `modal (${Math.round(box.height)}px) must fit the ${box.vh}px viewport`);
    assert.ok(box.top >= 0 && box.bottom <= box.vh, `modal must be fully on screen (top ${Math.round(box.top)}, bottom ${Math.round(box.bottom)}, vh ${box.vh})`);
  } finally {
    await ctx.close();
  }
});

// Layout guard: the close button sits outside the modal's top edge (on the backdrop),
// so it can't overlap the embed's own header controls.
test('close button sits outside the modal (above its top edge)', async () => {
  const { ctx, page } = await openHome(VIEWPORTS[0]);
  try {
    await page.click('.header-btn .donate-btn');
    await page.waitForTimeout(800);
    const { modalTop, closeTop } = await page.evaluate(() => ({
      modalTop: document.querySelector('.donate-modal').getBoundingClientRect().top,
      closeTop: document.querySelector('.donate-modal-close').getBoundingClientRect().top,
    }));
    assert.ok(closeTop < modalTop, `close button (top ${Math.round(closeTop)}) should sit above the modal top (${Math.round(modalTop)})`);
  } finally {
    await ctx.close();
  }
});
