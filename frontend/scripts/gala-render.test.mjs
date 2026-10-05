// End-to-end checks for the gala launch against the production build: /gala's
// share tags and content guarantees, the homepage gala slide, the /events gala
// card, and the sitemap/robots routes.
//
// The page computes the gala state in the browser from the real clock and the
// committed config, so date- and config-dependent assertions are keyed to the
// state the browser will compute today (and skip once it no longer applies).
// The pure logic for every state (money, calendar, ...) is in gala.test.mjs.
//
//   npm run build
//   node --test scripts/gala-render.test.mjs      (or: npm test)
import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { startServer, openPage, blockExternal } from './next-server.mjs';
import { cardTimeLabel, checkoutMode, getGalaState, providerInfo, timePublished } from '../lib/gala.js';
import { gala } from '../config/gala-2026.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const events = JSON.parse(readFileSync(path.resolve(__dirname, '../data/events.json'), 'utf8'));

const STATE = getGalaState(new Date());
const unless = (cond, why) => (cond ? false : `${why} (gala state today: ${STATE})`);
const TODAY = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Chicago' }).format(new Date());

const GALA = 'https://tombossabfoundation.org/gala';
const OG_IMAGE = 'https://tombossabfoundation.org/images/gala-2026-og.png';
// Visible text that must never reach the public page (unconfirmed values are
// null in config and must be hidden or replaced by a fallback).
const PLACEHOLDER = /\bTODO|\bnull\b|\bundefined\b|\bNaN\b|\[X\]|\[\s*\]/;

let stop, origin, browser;

before(async () => {
  ({ stop, origin } = await startServer());
  browser = await chromium.launch();
});

after(async () => {
  await browser?.close();
  stop?.();
});

// Pages render the build-time default state first and switch to today's state
// after hydration (useGalaState marks <html data-gala-state>); state-dependent
// checks must wait for that switch.
const waitForGalaState = (page) =>
  page.waitForFunction((s) => document.documentElement.dataset.galaState === s, STATE);
const openReady = async (route) => {
  const opened = await openPage(browser, origin, route);
  await waitForGalaState(opened.page);
  return opened;
};

const meta = (page, attr, key) =>
  page.locator(`meta[${attr}="${key}"]`).first().getAttribute('content');

// ------------------------------------------------------------------ /gala

test('/gala: link-preview tags are page-specific and absolute', async () => {
  const { ctx, page } = await openReady('/gala');
  try {
    assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), GALA);
    assert.equal(await meta(page, 'name', 'description'),
      'Dinner, music, a silent auction, and inspiring speakers — Saturday, November 28, 2026. Every ticket funds scholarships for Eritrean and East African youth.');
    assert.equal(await meta(page, 'property', 'og:title'), 'The Tombossa B Foundation Fundraising Gala · November 28, 2026');
    assert.equal(await meta(page, 'property', 'og:url'), GALA);
    assert.equal(await meta(page, 'property', 'og:type'), 'website');
    assert.equal(await meta(page, 'property', 'og:image'), OG_IMAGE);
    assert.equal(await meta(page, 'property', 'og:image:width'), '1200');
    assert.equal(await meta(page, 'property', 'og:image:height'), '630');
    assert.ok((await meta(page, 'property', 'og:image:alt')).length > 0, 'og:image:alt');
    assert.equal(await meta(page, 'name', 'twitter:card'), 'summary_large_image');
    assert.equal(await meta(page, 'name', 'twitter:title'), 'The Tombossa B Foundation Fundraising Gala · November 28, 2026');
    assert.equal(await meta(page, 'name', 'twitter:image'), OG_IMAGE);
  } finally {
    await ctx.close();
  }
  const og = await fetch(OG_IMAGE.replace('https://tombossabfoundation.org', origin));
  assert.equal(og.status, 200, 'the OG image must be served');
});

test('other pages no longer claim the homepage as their og:url', async () => {
  const { ctx, page } = await openReady('/about');
  try {
    assert.equal(await page.locator('meta[property="og:url"]').count(), 0);
    assert.equal(await meta(page, 'property', 'og:title'), 'Tombossa B Foundation');
    assert.equal(await meta(page, 'property', 'og:image'), 'https://tombossabfoundation.org/images/link-preview.png');
  } finally {
    await ctx.close();
  }
});

test('no placeholder text on /gala, the homepage, or /events', async () => {
  for (const route of ['/gala', '/', '/events']) {
    const { ctx, page } = await openReady(route);
    try {
      const text = await page.locator('body').innerText();
      const hit = text.match(PLACEHOLDER);
      assert.equal(hit, null, `${route} shows placeholder text: "${hit?.[0]}"`);
      assert.doesNotMatch(await page.content(), /TODO_CONFIRM/, `${route} HTML leaks a TODO_CONFIRM`);
    } finally {
      await ctx.close();
    }
  }
});

test('/gala: the tentative start time is not published anywhere',
  { skip: unless(!timePublished(), 'start time is confirmed') }, async () => {
  const { ctx, page } = await openReady('/gala');
  try {
    const html = await page.content();
    assert.match(await page.locator('#top').innerText(), /Time to be announced/);
    assert.doesNotMatch(await page.locator('body').innerText(), /5:00|17:00/);
    assert.equal(await page.locator('script[type="application/ld+json"]').count(), 0, 'no JSON-LD Event yet');
    assert.doesNotMatch(html, /calendar\.google\.com|\.ics/, 'no calendar links yet');
  } finally {
    await ctx.close();
  }
});

test('/gala: the confirmed start time, calendar links, and Event JSON-LD are published',
  { skip: unless(timePublished(), 'start time is not confirmed yet') }, async () => {
  const { ctx, page } = await openReady('/gala');
  try {
    assert.match(await page.locator('#top').innerText(), /5:00 PM/);
    const ld = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent());
    assert.equal(ld['@type'], 'Event');
    assert.equal(ld.startDate, '2026-11-28T17:00:00-06:00');
    assert.equal(ld.location.address.postalCode, '75243');
    assert.equal(ld.offers.length, 3);
    if (STATE !== 'past') {
      const google = page.locator('#share a[href^="https://calendar.google.com/"]');
      assert.equal(await google.count(), 1);
      assert.match(await google.getAttribute('href'), /dates=20261128T230000Z%2F20261128T230000Z/);
      assert.equal(await page.locator('#share button', { hasText: '.ics' }).count(), 1);
    }
  } finally {
    await ctx.close();
  }
});

test('/gala: confirmed venue renders (hero chip + FAQ with a lazy, titled map)', async () => {
  const { ctx, page } = await openReady('/gala');
  try {
    assert.match(await page.locator('#top').innerText(), /Empire Event Center · Dallas/);
    const faq = page.locator('#faq');
    await faq.getByRole('button', { name: 'When and where is the gala?' }).click();
    const panel = faq.locator('[role="region"]:visible');
    assert.match(await panel.innerText(), /9560 Skillman St, Suite 126/);
    assert.match(await panel.innerText(), /Dallas, TX 75243/);
    const map = panel.locator('iframe');
    assert.equal(await map.getAttribute('loading'), 'lazy');
    assert.equal(await map.getAttribute('title'), 'Map to Empire Event Center');
    const questions = (await faq.locator('button[aria-expanded]').allInnerTexts()).map((q) => q.trim());
    assert.deepEqual(questions, [
      'What should I wear?', 'When and where is the gala?', 'What do I need to bring?',
      'Is the gala open to all ages?', 'Is the venue accessible?', 'Can I buy tickets for other people?',
      "What's the refund policy?", 'Is my ticket tax-deductible?', 'Why does checkout ask for an optional tip?',
      'Who do I contact with questions?',
    ]);
  } finally {
    await ctx.close();
  }
});

test('/gala: one h1 and every section anchor', async () => {
  const { ctx, page } = await openReady('/gala');
  try {
    assert.equal(await page.locator('h1').count(), 1, 'exactly one h1');
    const ids = STATE === 'past'
      ? ['top', 'story', 'evening', 'scholars', 'give', 'faq', 'share']
      : ['top', 'story', 'evening', 'scholars', 'tickets', 'sponsor', 'give', 'faq', 'share'];
    // In this order: "Can't Make It?" follows the tickets, before sponsorship.
    const sectionOrder = await page.locator('main section[id]').evaluateAll((els) => els.map((e) => e.id));
    assert.deepEqual(sectionOrder, STATE === 'past'
      ? ['top', 'story', 'evening', 'scholars', 'give', 'faq', 'share']
      : ['top', 'story', 'evening', 'scholars', 'tickets', 'give', 'sponsor', 'faq', 'share']);
    for (const id of ids) {
      assert.equal(await page.locator(`section#${id}`).count(), 1, `section #${id}`);
    }
  } finally {
    await ctx.close();
  }
});

test('/gala: no Get Tickets buttons once online sales close', async () => {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  try {
    await blockExternal(page, origin);
    // Gala day, after online sales close (the browser re-checks its own clock).
    await page.clock.setFixedTime(new Date('2026-11-28T14:00:00-06:00'));
    await page.goto(`${origin}/gala`, { waitUntil: 'load', timeout: 30000 });
    await page.waitForFunction(() => document.documentElement.dataset.galaState === 'online_closed');
    const hero = await page.locator('#top').innerText();
    assert.doesNotMatch(hero, /Get Tickets/i);
    assert.equal(/Tickets at the Door/i.test(hero), gala.sales.doorSalesAvailable);
    assert.doesNotMatch(await page.locator('#share').innerText(), /Get Tickets/i);
  } finally {
    await ctx.close();
  }
});

test('/gala: ticket section content follows the state and the checkout config',
  { skip: unless(STATE !== 'past', 'tickets are hidden after the event') }, async () => {
  const { ctx, page } = await openReady('/gala');
  try {
    const selling = ['coming_soon', 'on_sale'].includes(STATE);
    const hero = await page.locator('#top').innerText();
    if (selling) assert.match(hero, /^ANNOUNCING A NEW TRADITION\s+Our Annual\s+Fundraising Gala\s+2026/i);
    else assert.doesNotMatch(hero, /ANNOUNCING/i);

    const tickets = page.locator('#tickets');
    const text = await tickets.innerText();
    // Prices come from config; Champion is the featured tier.
    assert.match(text, /\$30[\s\S]*\$55[\s\S]*\$85/);
    assert.match(text, /THE FULL EXPERIENCE/i);
    assert.match(text, /Student & Youth \$40 · General Admission \$65 · Champion \$95\./);
    assert.match(text, /For current students and guests 17 and younger\./);
    assert.doesNotMatch(await page.locator('body').innerText(), /student ID/i, 'no ID requirement for admission');
    assert.equal(/Online sales close Saturday, November 28 at 12:00 PM\./.test(text), selling);
    assert.equal(/Tickets go on sale soon\./.test(text), STATE === 'coming_soon');
    assert.equal(/Online ticket sales have closed\./.test(text), STATE === 'online_closed');

    // Sponsorship opens the pop-up checkout while it's available, else falls back to email.
    const popUp = checkoutMode() === 'modal' && STATE === 'on_sale';
    const sponsorButtons = await page.locator('#sponsor button', { hasText: 'Become a Sponsor' }).count();
    const sponsorMail = await page.locator('#sponsor a[href^="mailto:contact@tombossabfoundation.org?subject=Gala%202026%20Sponsorship"]').count();
    assert.deepEqual([sponsorButtons, sponsorMail], popUp ? [3, 0] : [0, 3]);

    // The optional-tip question appears only for Zeffy.
    assert.equal(/optional tip/.test(await page.locator('#faq').innerText()), Boolean(providerInfo()?.tipFaq));
  } finally {
    await ctx.close();
  }
});

test('/gala: the ?galaState override is ignored in production',
  { skip: unless(STATE !== 'past', 'needs the tickets section') }, async () => {
  const { ctx, page } = await openReady('/gala?galaState=past');
  try {
    await page.waitForTimeout(300);
    assert.equal(await page.locator('#tickets').count(), 1, 'tickets must still render');
    assert.equal(await page.locator('details', { hasText: 'DEV' }).count(), 0, 'no dev checklist');
  } finally {
    await ctx.close();
  }
});

test('/gala: FAQ accordion is keyboard-operable', async () => {
  const { ctx, page } = await openReady('/gala');
  try {
    const button = page.locator('#faq button').first();
    const panelId = await button.getAttribute('aria-controls');
    assert.equal(await button.getAttribute('aria-expanded'), 'false');
    await button.focus();
    await page.keyboard.press('Enter');
    assert.equal(await button.getAttribute('aria-expanded'), 'true');
    assert.ok(await page.locator(`#${panelId}`).isVisible());
    await page.keyboard.press('Space');
    assert.equal(await button.getAttribute('aria-expanded'), 'false');
  } finally {
    await ctx.close();
  }
});

test('/gala: no horizontal scroll at 320px; reduced motion hides nothing', async () => {
  const ctx = await browser.newContext({ viewport: { width: 320, height: 640 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  try {
    await blockExternal(page, origin);
    await page.goto(`${origin}/gala`, { waitUntil: 'load' });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), 320);
    assert.equal(await page.locator('[data-reveal="pending"]').count(), 0);
  } finally {
    await ctx.close();
  }
});

test('/gala on phones: a gold "Gala Tickets" side tab replaces the Donate tab',
  { skip: unless(['coming_soon', 'on_sale'].includes(STATE), 'the side tab only shows while tickets sell') }, async () => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 664 } });
  try {
    const page = await ctx.newPage();
    await blockExternal(page, origin);
    await page.goto(`${origin}/gala`, { waitUntil: 'load' });
    await waitForGalaState(page);
    assert.equal(await page.locator('.donate-floating').count(), 0, 'no Donate side tab on /gala');
    const tab = page.locator('a[class*="GalaNavButton_floating"]');
    assert.ok(await tab.isVisible());
    assert.equal((await tab.innerText()).trim(), 'GALA TICKETS');
    assert.equal(await tab.getAttribute('href'), '#tickets');

    await page.goto(`${origin}/about`, { waitUntil: 'load' });
    await waitForGalaState(page);
    assert.ok(await page.locator('.donate-floating').isVisible(), 'other pages keep the Donate side tab');
    assert.equal(await page.locator('a[class*="GalaNavButton_floating"]').count(), 0);
  } finally {
    await ctx.close();
  }
});

test('desktop header "Gala Tickets" button actually receives clicks (not covered by the nav)',
  { skip: unless(STATE !== 'past', 'the button is gone after the event') }, async () => {
  for (const width of [1100, 1280, 1440, 1920]) {
    const ctx = await browser.newContext({ viewport: { width, height: 900 } });
    try {
      const page = await ctx.newPage();
      await blockExternal(page, origin);
      await page.goto(`${origin}/about`, { waitUntil: 'load' });
      await waitForGalaState(page);
      const hit = await page.locator('header a[class*="GalaNavButton_desktop"]').evaluate((el) => {
        const r = el.getBoundingClientRect();
        const top = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
        return el === top || el.contains(top);
      });
      assert.ok(hit, `at ${width}px something else sits on top of the button`);
    } finally {
      await ctx.close();
    }
  }
});

test('/gala: each sponsor tier lists its reserved table as the last checklist item',
  { skip: unless(STATE !== 'past', 'sponsor levels are hidden after the event') }, async () => {
  const { ctx, page } = await openReady('/gala');
  try {
    const lastItems = await page.locator('#sponsor > div > ul > li').evaluateAll((cards) =>
      cards.map((card) => [...card.querySelectorAll('ul li')].at(-1)?.textContent.trim()));
    assert.deepEqual(lastItems, [
      'Reserved table for 5',
      'Reserved table for 8, with Champion benefits',
      'Reserved table for 8, with Champion benefits',
    ]);
    assert.doesNotMatch(await page.locator('#sponsor').innerText(), /Includes a reserved table/);
  } finally {
    await ctx.close();
  }
});

test('/gala: the Student & Youth ticket includes no drink ticket',
  { skip: unless(STATE !== 'past', 'tickets are hidden after the event') }, async () => {
  const { ctx, page } = await openReady('/gala');
  try {
    const card = page.locator('#tickets > div > ul > li').filter({ has: page.locator('h3', { hasText: 'Student & Youth' }) });
    assert.deepEqual((await card.locator('ul li').allTextContents()).map((t) => t.trim()), ['Dinner', 'The full program']);
    assert.doesNotMatch(await card.innerText(), /drink/i);
  } finally {
    await ctx.close();
  }
});

test('/gala: Champion promises no reception; its extra proceeds go to mental wellness',
  { skip: unless(STATE !== 'past', 'tickets are hidden after the event') }, async () => {
  const { ctx, page } = await openReady('/gala');
  try {
    const card = page.locator('#tickets > div > ul > li').filter({ has: page.locator('h3', { hasText: 'Champion' }) });
    const items = (await card.locator('ul li').allTextContents()).map((t) => t.trim());
    assert.equal(items.at(-1), 'Extra proceeds support our mental wellness services');
    assert.doesNotMatch(await page.locator('body').innerText(), /reception|Negusse family/i);
    assert.doesNotMatch(await card.innerText(), /Future Scholar Fund/);
  } finally {
    await ctx.close();
  }
});

test('/gala: tax-deductible estimates on cards ($0 hidden) and in the FAQ (every option)',
  { skip: unless(STATE !== 'past', 'ticket and sponsor cards are hidden after the event') }, async () => {
  const { ctx, page } = await openReady('/gala');
  try {
    const cardLine = async (section, name) => {
      const card = page.locator(`${section} > div > ul > li`).filter({ has: page.locator('h3', { hasText: name }) });
      const line = card.getByText(/^Est\. tax-deductible:/);
      return (await line.count()) ? (await line.innerText()).trim() : null;
    };
    assert.equal(await cardLine('#tickets', 'Student & Youth'), null, 'a $0 estimate is hidden');
    assert.equal(await cardLine('#tickets', 'General Admission'), 'Est. tax-deductible: $15');
    assert.equal(await cardLine('#tickets', 'Champion'), 'Est. tax-deductible: $25');
    assert.equal(await cardLine('#sponsor', 'Community Sponsor'), 'Est. tax-deductible: $300');
    assert.equal(await cardLine('#sponsor', 'Legacy Sponsor'), 'Est. tax-deductible: $520');
    assert.equal(await cardLine('#sponsor', 'Scholarship Sponsor'), 'Est. tax-deductible: $2,020');
    assert.match(await page.locator('#give').innerText(), /Fully tax-deductible/);

    await page.locator('#faq').getByRole('button', { name: 'Is my ticket tax-deductible?' }).click();
    const items = await page.locator('#faq [role="region"]:visible li').allTextContents();
    assert.deepEqual(items.map((t) => t.trim()), [
      'Student & Youth: $0', 'General Admission: $15', 'Champion: $25', 'Community Sponsor: $300',
      'Legacy Sponsor: $520', 'Scholarship Sponsor: $2,020', 'Sponsor a Seat: $55',
    ]);
  } finally {
    await ctx.close();
  }
});

test('/gala: "Can\'t Make It?" embeds the Zeffy donation form, with a working fallback', async () => {
  const { ctx, page } = await openReady('/gala');
  try {
    const card = page.locator('#give').getByRole('heading', { name: 'Give to the Scholarship Fund' }).locator('..');
    // Server-rendered placeholder for Zeffy's embed script.
    const html = await (await fetch(`${origin}/gala`)).text();
    assert.match(html, /data-zeffy-embed="" data-form-url="\/embed\/donation-form\/scholarship-fund-79"/);
    // The test browser blocks external scripts, so the script "fails" here and
    // the plain iframe from Zeffy's embed code must take over.
    const fallback = card.locator('iframe[title="Donation form powered by Zeffy"]');
    await fallback.waitFor({ timeout: 10000 });
    assert.equal(await fallback.getAttribute('src'), gala.checkout.donationForm.fallbackSrc);
    assert.equal(await card.locator('[data-zeffy-embed]').count(), 0);

    // Leave and come back by client-side navigation (the card remounts, the
    // failed script is cached): the fallback must still be there, not a blank card.
    await page.evaluate(() => { window.__sameDocument = true; });
    await page.evaluate(() => window.next.router.push('/about'));
    await page.waitForURL('**/about');
    await page.evaluate(() => window.next.router.push('/gala'));
    await page.waitForURL('**/gala');
    await fallback.waitFor({ timeout: 10000 });
    assert.equal(await page.evaluate(() => window.__sameDocument), true, 'stayed a client-side navigation');
    assert.equal(await card.locator('[data-zeffy-embed]').count(), 0);
  } finally {
    await ctx.close();
  }
});

test('side menu: opens, closes, and closes on a same-page Gala Tickets jump and on navigation',
  { skip: unless(STATE !== 'past', 'the menu has no gala button after the event') }, async () => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  try {
    await blockExternal(page, origin);
    await page.goto(`${origin}/gala`, { waitUntil: 'load', timeout: 30000 });
    await waitForGalaState(page);
    const menu = page.locator('.side-nav-container');
    const isOpen = () => menu.evaluate((el) => el.classList.contains('active'));

    await page.click('.mobile-menu-toggle');
    assert.equal(await isOpen(), true, 'hamburger opens the menu');
    await page.click('.side-menu-close');
    assert.equal(await isOpen(), false, 'close icon closes it');

    await page.click('.mobile-menu-toggle');
    await menu.locator('a[href="#tickets"]').click();
    assert.equal(await isOpen(), false, 'a same-page jump to #tickets closes it');

    await page.click('.mobile-menu-toggle');
    await menu.locator('a[href="/about"]').click();
    await page.waitForURL('**/about');
    assert.equal(await isOpen(), false, 'navigating to another page closes it');
  } finally {
    await ctx.close();
  }
});

test('/gala: the tax FAQ shows the foundation EIN', async () => {
  const { ctx, page } = await openReady('/gala');
  try {
    await page.locator('#faq').getByRole('button', { name: 'Is my ticket tax-deductible?' }).click();
    assert.match(await page.locator('#faq [role="region"]:visible').innerText(), /501\(c\)\(3\) nonprofit, EIN 99-4436179\./);
  } finally {
    await ctx.close();
  }
});

// Regression: following the homepage slide's "Become a Sponsor" (/gala#sponsor)
// once left most of the page stuck invisible behind the scroll-reveal effect.
test('arriving at /gala via an anchor link hides nothing (slide "Become a Sponsor")',
  { skip: unless(STATE === 'coming_soon' || STATE === 'on_sale', 'the slide sponsor button shows only before sales close') }, async () => {
  for (const [width, height] of [[390, 664], [1440, 900]]) {
    const ctx = await browser.newContext({ viewport: { width, height } });
    try {
      const page = await ctx.newPage();
      await blockExternal(page, origin);
      await page.goto(`${origin}/`, { waitUntil: 'load' });
      await waitForGalaState(page);
      await page.waitForFunction(() => document.querySelector('.frontpageSwiper')?.swiper);
      await page.locator('.swiper-slide-active .slide-bg-gala a', { hasText: /become a sponsor/i }).click();
      await page.waitForURL('**/gala#sponsor');
      await page.waitForTimeout(500);
      assert.equal(await page.locator('[data-reveal="pending"]').count(), 0, `hidden content at ${width}px`);
      assert.ok(await page.locator('#sponsor h2').isVisible());
    } finally {
      await ctx.close();
    }
  }
});

test('/gala scroll-reveal never strands content (plain visit, scroll to the end)', async () => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 664 } });
  try {
    const page = await ctx.newPage();
    await blockExternal(page, origin);
    await page.goto(`${origin}/gala`, { waitUntil: 'load' });
    await page.waitForTimeout(300);
    assert.ok(await page.locator('[data-reveal="pending"]').count() > 0, 'below-the-fold content animates in on a plain visit');
    const height = await page.evaluate(() => document.body.scrollHeight);
    // Instant, not the page's smooth scrolling, so each step actually lands.
    for (let y = 0; y <= height; y += 250) {
      await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), y);
      await page.waitForTimeout(60);
    }
    await page.waitForTimeout(300);
    assert.equal(await page.locator('[data-reveal="pending"]').count(), 0);
  } finally {
    await ctx.close();
  }
});

test('/gala on sale: every ticket, sponsor, and Sponsor a Seat button opens the pop-up checkout',
  { skip: unless(STATE === 'on_sale' && checkoutMode() === 'modal', 'needs the pop-up checkout on sale') }, async () => {
  const { ctx, page } = await openReady('/gala');
  try {
    const dialog = page.locator('[role="dialog"][aria-label="Gala ticket checkout"]');
    // Wait for hydration (the countdown only renders client-side) so clicks have handlers.
    await page.locator('#top').getByText(/days? to go|Tonight/).waitFor();
    assert.equal(await dialog.count(), 0, 'the form is not loaded until someone asks for it');
    assert.doesNotMatch(await page.locator('#tickets').innerText(), /on sale soon/);
    assert.match(await page.locator('#faq').innerText(), /Why does checkout ask for an optional tip\?/);

    const buttons = [
      ...await page.locator('#tickets button', { hasText: 'Get Tickets' }).all(),
      ...await page.locator('#sponsor button', { hasText: 'Become a Sponsor' }).all(),
      page.locator('#give button', { hasText: 'Sponsor a Seat' }),
    ];
    assert.equal(buttons.length, 3 + 3 + 1);
    assert.equal(await page.getByText('Get Your Tickets').count(), 0, 'no extra button under the tiers');
    for (const button of buttons) {
      await button.scrollIntoViewIfNeeded();
      await button.click();
      await dialog.waitFor({ state: 'visible', timeout: 5000 }); // mounts on the next render
      assert.equal(await dialog.locator('iframe').getAttribute('src'), gala.checkout.tickets.modalUrl);
      assert.equal(await page.evaluate(() => document.getElementById('app-root').hasAttribute('inert')), true);
      await page.keyboard.press('Escape');
      await dialog.waitFor({ state: 'hidden', timeout: 5000 });
    }
    assert.equal(await dialog.locator('iframe').count(), 1, 'one form instance, reused');
  } finally {
    await ctx.close();
  }
});

// ------------------------------------------------------------------ homepage & /events

test('homepage: the gala slide leads, existing slides keep their order',
  { skip: unless(['coming_soon', 'on_sale'].includes(STATE), 'slide copy before sales close') }, async () => {
  const { ctx, page } = await openReady('/');
  try {
    // Swiper initializes after hydration; wait for it before reading its state.
    await page.waitForFunction(() => document.querySelector('.frontpageSwiper')?.swiper);
    // Swiper's loop mode reorders DOM nodes, so read its own slide order.
    const slides = await page.evaluate(() => {
      const swiper = document.querySelector('.frontpageSwiper').swiper;
      return [...swiper.slides]
        .sort((a, b) => Number(a.dataset.swiperSlideIndex) - Number(b.dataset.swiperSlideIndex))
        .map((s) => s.innerText.replace(/\s+/g, ' ').trim());
    });
    assert.equal(slides.length, 4);
    assert.match(slides[0], /^ANNOUNCING A NEW TRADITION Our Annual Fundraising Gala SATURDAY, NOVEMBER 28, 2026 · DALLAS/i);
    assert.match(slides[0], /An evening for the next generation\. One unforgettable night for our scholars\./);
    assert.doesNotMatch(slides[0], /\d:\d\d/, 'no time on the slide');
    assert.match(slides[1], /^Empowering Eritrean/);
    assert.match(slides[2], /^Read our September Newsletter/);
    assert.match(slides[3], /^Meet our scholarship award recipients/);
    assert.equal(await page.evaluate(() => document.querySelector('.frontpageSwiper').swiper.realIndex), 0);
    // "Learn More" before sales open, "Get Tickets" while on sale; plus the sponsor link.
    assert.equal(await page.locator('.slide-bg-gala a[href="/gala"]').first().innerText(),
      STATE === 'on_sale' ? 'GET TICKETS' : 'LEARN MORE');
    assert.ok(await page.locator('.slide-bg-gala a[href="/gala#sponsor"]').count() >= 1);
  } finally {
    await ctx.close();
  }
});

test('/events: Upcoming (gala card -> /gala) above Past (fixture events, unchanged)',
  { skip: unless(STATE !== 'past', 'the gala card has moved to Past Events') }, async () => {
  const { ctx, page } = await openReady('/events');
  try {
    const headings = await page.locator('.section__title').allInnerTexts();
    assert.deepEqual(headings.slice(0, 2), ['Upcoming Events', 'Past Events']);

    const [upcoming, past] = [page.locator('.causes-area').nth(0), page.locator('.causes-area').nth(1)];
    const card = upcoming.locator('.blog-item');
    assert.equal(await card.count(), 1);
    assert.equal(await card.locator('.blog__title a').innerText(), 'Tombossa B Foundation Fundraising Gala 2026');
    assert.equal(await card.locator('.blog__title a').getAttribute('href'), '/gala');
    assert.equal(await card.locator('.blog-img a').getAttribute('href'), '/gala');
    assert.equal((await card.locator('.blog__tag').textContent()).replace(/\s+/g, ''), '28Nov2026');
    const meta = await card.locator('.blog__list li').allTextContents();
    assert.deepEqual(meta.map((m) => m.trim()), [cardTimeLabel(), 'Empire Event Center', 'Dallas, TX']);
    assert.equal(await card.locator('.event-card__pill').count(), STATE === 'on_sale' ? 1 : 0, '"Tickets on sale" pill only while on sale');

    const pastTitles = await past.locator('.blog__title').allInnerTexts();
    const expected = events.filter((e) => e.eventDate < TODAY).map((e) => e.title);
    assert.deepEqual(pastTitles.map((t) => t.trim()), expected);
  } finally {
    await ctx.close();
  }
});

test('homepage events section is unchanged (no gala card)', async () => {
  const { ctx, page } = await openReady('/');
  try {
    assert.equal(await page.locator('.causes-area a[href="/gala"]').count(), 0);
  } finally {
    await ctx.close();
  }
});

// ------------------------------------------------------------------ sitemap & robots

test('sitemap lists /gala and every public page; robots allows crawling', async () => {
  const xml = await (await fetch(`${origin}/sitemap.xml`)).text();
  for (const p of ['/gala', '/about', '/events', '/events/coffee-women-empowerment-1', '/award-recipients']) {
    assert.ok(xml.includes(`<loc>https://tombossabfoundation.org${p}</loc>`), `sitemap missing ${p}`);
  }
  const robots = await (await fetch(`${origin}/robots.txt`)).text();
  assert.match(robots, /Allow: \//);
  assert.doesNotMatch(robots, /Disallow: \/gala/);
  assert.match(robots, /Sitemap: https:\/\/tombossabfoundation\.org\/sitemap\.xml/);
});
