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
import { cardTimeLabel, getGalaState, timePublished } from '../lib/gala.js';

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

const meta = (page, attr, key) =>
  page.locator(`meta[${attr}="${key}"]`).first().getAttribute('content');

// ------------------------------------------------------------------ /gala

test('/gala: link-preview tags are page-specific and absolute', async () => {
  const { ctx, page } = await openPage(browser, origin, '/gala');
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
  const { ctx, page } = await openPage(browser, origin, '/about');
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
    const { ctx, page } = await openPage(browser, origin, route);
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
  const { ctx, page } = await openPage(browser, origin, '/gala');
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
  const { ctx, page } = await openPage(browser, origin, '/gala');
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
  const { ctx, page } = await openPage(browser, origin, '/gala');
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
    assert.match(await faq.innerText(), /Is there parking\?/);
  } finally {
    await ctx.close();
  }
});

test('/gala: one h1 and every section anchor', async () => {
  const { ctx, page } = await openPage(browser, origin, '/gala');
  try {
    assert.equal(await page.locator('h1').count(), 1, 'exactly one h1');
    const ids = STATE === 'past'
      ? ['top', 'story', 'evening', 'scholars', 'give', 'faq', 'share']
      : ['top', 'story', 'evening', 'scholars', 'tickets', 'sponsor', 'give', 'faq', 'share'];
    for (const id of ids) {
      assert.equal(await page.locator(`section#${id}`).count(), 1, `section #${id}`);
    }
  } finally {
    await ctx.close();
  }
});

test('/gala: pre-sale state (no checkout yet) and Donorbox-only FAQ',
  { skip: unless(STATE === 'coming_soon', 'pre-sale assertions') }, async () => {
  const { ctx, page } = await openPage(browser, origin, '/gala');
  try {
    assert.match(await page.locator('#top').innerText(), /^ANNOUNCING A NEW ANNUAL TRADITION\s+The Tombossa\sB Foundation Fundraising Gala/i);
    // Checkout isn't configured: no checkout CTAs or embed, "on sale soon" instead.
    const tickets = page.locator('#tickets');
    assert.match(await tickets.innerText(), /Tickets go on sale soon\./);
    assert.equal(await tickets.locator('iframe').count(), 0);
    assert.equal(await tickets.getByText('Select tickets below').count(), 0);
    assert.equal(await page.locator('a[href="#subscribe"]').first().count(), 1);
    // Prices come from config; Champion is the featured tier.
    assert.match(await tickets.innerText(), /\$30[\s\S]*\$55[\s\S]*\$85/);
    assert.match(await tickets.innerText(), /THE FULL EXPERIENCE/i);
    assert.match(await tickets.innerText(), /Online sales close Saturday, November 28 at 12:00 PM\./);
    assert.match(await tickets.innerText(), /Student & Youth \$40 · General Admission \$65 · Champion \$95\./);
    assert.match(await tickets.innerText(), /For current students and guests 17 and younger\./);
    assert.doesNotMatch(await page.locator('body').innerText(), /student ID/i, 'no ID requirement for admission');
    // Sponsorship falls back to email while no checkout link exists.
    assert.ok(await page.locator('#sponsor a[href^="mailto:contact@tombossabfoundation.org?subject=Gala%202026%20Sponsorship"]').count() >= 3);
    // Provider is Donorbox: the Zeffy tip question must not render.
    assert.doesNotMatch(await page.locator('#faq').innerText(), /optional tip/);
  } finally {
    await ctx.close();
  }
});

test('/gala: the ?galaState override is ignored in production',
  { skip: unless(STATE !== 'past', 'needs the tickets section') }, async () => {
  const { ctx, page } = await openPage(browser, origin, '/gala?galaState=past');
  try {
    await page.waitForTimeout(300);
    assert.equal(await page.locator('#tickets').count(), 1, 'tickets must still render');
    assert.equal(await page.locator('details', { hasText: 'DEV' }).count(), 0, 'no dev checklist');
  } finally {
    await ctx.close();
  }
});

test('/gala: FAQ accordion is keyboard-operable', async () => {
  const { ctx, page } = await openPage(browser, origin, '/gala');
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
    assert.equal(await page.locator('.donate-floating').count(), 0, 'no Donate side tab on /gala');
    const tab = page.locator('a[class*="GalaNavButton_floating"]');
    assert.ok(await tab.isVisible());
    assert.equal((await tab.innerText()).trim(), 'GALA TICKETS');
    assert.equal(await tab.getAttribute('href'), '#tickets');

    await page.goto(`${origin}/about`, { waitUntil: 'load' });
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
  const { ctx, page } = await openPage(browser, origin, '/gala');
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
  const { ctx, page } = await openPage(browser, origin, '/gala');
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
  const { ctx, page } = await openPage(browser, origin, '/gala');
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
  const { ctx, page } = await openPage(browser, origin, '/gala');
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

test('/gala: the tax FAQ shows the foundation EIN', async () => {
  const { ctx, page } = await openPage(browser, origin, '/gala');
  try {
    await page.locator('#faq').getByRole('button', { name: 'Is my ticket tax-deductible?' }).click();
    assert.match(await page.locator('#faq [role="region"]:visible').innerText(), /501\(c\)\(3\) nonprofit, EIN 99-4436179\./);
  } finally {
    await ctx.close();
  }
});

// ------------------------------------------------------------------ homepage & /events

test('homepage: the gala slide leads, existing slides keep their order',
  { skip: unless(STATE === 'coming_soon', 'pre-sale slide assertions') }, async () => {
  const { ctx, page } = await openPage(browser, origin, '/');
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
    assert.match(slides[0], /^ANNOUNCING A NEW ANNUAL TRADITION The Tombossa\sB Foundation Fundraising Gala SATURDAY, NOVEMBER 28, 2026 · DALLAS/i);
    assert.match(slides[0], /An evening for the next generation\. One unforgettable night for our scholars\./);
    assert.doesNotMatch(slides[0], /\d:\d\d/, 'no time on the slide');
    assert.match(slides[1], /^Empowering Eritrean/);
    assert.match(slides[2], /^Read our September Newsletter/);
    assert.match(slides[3], /^Meet our scholarship award recipients/);
    assert.equal(await page.evaluate(() => document.querySelector('.frontpageSwiper').swiper.realIndex), 0);
    // Pre-sale state: "Learn More" -> /gala, plus the sponsor link.
    assert.equal(await page.locator('.slide-bg-gala a[href="/gala"]').first().innerText(), 'LEARN MORE');
    assert.ok(await page.locator('.slide-bg-gala a[href="/gala#sponsor"]').count() >= 1);
  } finally {
    await ctx.close();
  }
});

test('/events: Upcoming (gala card -> /gala) above Past (fixture events, unchanged)',
  { skip: unless(STATE !== 'past', 'the gala card has moved to Past Events') }, async () => {
  const { ctx, page } = await openPage(browser, origin, '/events');
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
  const { ctx, page } = await openPage(browser, origin, '/');
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
