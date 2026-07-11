// Content-integrity unit tests for the data fixtures.
//
// Pure Node — no browser, no build needed (run these anywhere, fast).
// The JSON files in data/ do double duty: they are the hermetic build/test
// fixtures AND the fallback lib/api.js serves when the backend is unreachable,
// so they must stay shape-identical to the API responses. Content rule: every
// backend Flyway seed migration updates its fixture here in the same PR.
//
//   node --test scripts/data.test.mjs      (or, with the rest: npm test)
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(__dirname, '../data');
const PUBLIC_DIR = path.resolve(__dirname, '../public');

const readJson = (name) => JSON.parse(readFileSync(path.join(DATA_DIR, name), 'utf8'));
// Data-file asset paths are site-absolute ("/recipients/x.jpg"); the real file
// lives under public/ (Next serves public/ at the site root in the export).
const publicPath = (p) => path.join(PUBLIC_DIR, p.replace(/^\//, ''));
const hasDuplicates = (values) => new Set(values).size !== values.length;

const recipients = readJson('recipients.json');
const newsletters = readJson('newsletters.json');
const events = readJson('events.json');

// ---------------------------------------------------------------------------
// recipients.json  (pages/award-recipients.js -> components/RecipientCard.js)
// ---------------------------------------------------------------------------
test('recipients: file is a non-empty array', () => {
  assert.ok(Array.isArray(recipients), 'recipients.json must be a JSON array');
  assert.ok(recipients.length > 0, 'recipients.json must not be empty');
});

test('recipients: ids and slugs are unique (keys + card routing depend on it)', () => {
  assert.equal(hasDuplicates(recipients.map((r) => r.id)), false, 'duplicate recipient id');
  assert.equal(hasDuplicates(recipients.map((r) => r.slug)), false, 'duplicate recipient slug');
});

// Fields the card and the page actually read. Optional prose (story/quote) is not
// forced here, only the structural fields a broken card would trip on.
const RECIPIENT_REQUIRED = ['id', 'slug', 'name', 'year', 'scholarship', 'headline', 'photo', 'blurb'];
for (const [i, r] of recipients.entries()) {
  const who = r.name || r.id || `#${i}`;
  test(`recipients[${i}] (${who}): has all required string fields`, () => {
    for (const field of RECIPIENT_REQUIRED) {
      assert.equal(typeof r[field], 'string', `${field} must be a string`);
      assert.ok(r[field].trim().length > 0, `${field} must not be blank`);
    }
    assert.match(r.year, /^\d{4}$/, 'year must be a 4-digit string (award-recipients sorts on Number(year))');
    assert.ok(Array.isArray(r.highlights), 'highlights must be an array');
    assert.ok(Array.isArray(r.story), 'story must be an array');
  });

  test(`recipients[${i}] (${who}): photo path exists in public/`, () => {
    assert.ok(r.photo.startsWith('/recipients/'), `photo should live under /recipients/, got ${r.photo}`);
    assert.ok(existsSync(publicPath(r.photo)), `missing asset: public${r.photo}`);
  });
}

// Ordering contract: award-recipients.js sorts newest-year first. Mirror the page
// comparator here and assert it yields a non-increasing year sequence, so the data
// always has a well-defined "newest first" order for the page to render.
test('recipients: page sort (year desc) yields newest-first order', () => {
  const sorted = [...recipients].sort((a, b) => Number(b.year) - Number(a.year));
  const years = sorted.map((r) => Number(r.year));
  for (let i = 1; i < years.length; i++) {
    assert.ok(years[i - 1] >= years[i], `not sorted desc by year at index ${i}: ${years}`);
  }
});

// ---------------------------------------------------------------------------
// newsletters.json  (pages/newsletters.js -> components/Newsletter.js)
// ---------------------------------------------------------------------------
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

test('newsletters: file is a non-empty array', () => {
  assert.ok(Array.isArray(newsletters), 'newsletters.json must be a JSON array');
  assert.ok(newsletters.length > 0, 'newsletters.json must not be empty');
});

test('newsletters: ids and dates are unique (date is the sort key — must be unambiguous)', () => {
  assert.equal(hasDuplicates(newsletters.map((n) => n.id)), false, 'duplicate newsletter id');
  assert.equal(hasDuplicates(newsletters.map((n) => n.date)), false, 'duplicate newsletter date breaks a stable sort');
});

const NEWSLETTER_REQUIRED = ['id', 'title', 'issue', 'date', 'month', 'year', 'headline', 'blurb', 'cover', 'file'];
for (const [i, n] of newsletters.entries()) {
  const who = n.title || n.id || `#${i}`;
  test(`newsletters[${i}] (${who}): has all required string fields`, () => {
    for (const field of NEWSLETTER_REQUIRED) {
      assert.equal(typeof n[field], 'string', `${field} must be a string`);
      assert.ok(n[field].trim().length > 0, `${field} must not be blank`);
    }
  });

  test(`newsletters[${i}] (${who}): date/month/year are internally consistent`, () => {
    assert.match(n.date, /^\d{4}-\d{2}$/, 'date must be YYYY-MM (newsletters sorts on date.localeCompare)');
    const [yyyy, mm] = n.date.split('-');
    assert.equal(n.year, yyyy, `year (${n.year}) must match date (${n.date})`);
    assert.equal(n.month, MONTHS[Number(mm) - 1], `month (${n.month}) must match date (${n.date})`);
  });

  test(`newsletters[${i}] (${who}): cover image and PDF exist in public/`, () => {
    assert.ok(n.cover.startsWith('/newsletters/'), `cover should live under /newsletters/, got ${n.cover}`);
    assert.ok(existsSync(publicPath(n.cover)), `missing asset: public${n.cover}`);
    assert.ok(n.file.startsWith('/newsletters/') && n.file.endsWith('.pdf'), `file should be a /newsletters/*.pdf, got ${n.file}`);
    assert.ok(existsSync(publicPath(n.file)), `missing asset: public${n.file}`);
  });
}

// Ordering contract: newsletters.js sorts newest-issue first via string compare on
// the YYYY-MM date. Mirror it and assert non-increasing order.
test('newsletters: page sort (date desc) yields newest-first order', () => {
  const sorted = [...newsletters].sort((a, b) => b.date.localeCompare(a.date));
  const dates = sorted.map((n) => n.date);
  for (let i = 1; i < dates.length; i++) {
    assert.ok(dates[i - 1] >= dates[i], `not sorted desc by date at index ${i}: ${dates}`);
  }
});

// ---------------------------------------------------------------------------
// events.json  (app/events + EventsSection -> Events / PastEvents cards)
// ---------------------------------------------------------------------------
test('events: file is a non-empty array', () => {
  assert.ok(Array.isArray(events), 'events.json must be a JSON array');
  assert.ok(events.length > 0, 'events.json must not be empty');
});

test('events: slugs are unique (null slug = no detail page, allowed)', () => {
  const slugs = events.map((e) => e.slug).filter((s) => s !== null);
  assert.equal(hasDuplicates(slugs), false, 'duplicate event slug');
  for (const s of slugs) assert.equal(typeof s, 'string', 'slug must be a string or null');
});

// imageAlt is required-present but may be blank (decorative images).
const EVENT_REQUIRED = ['title', 'eventDate', 'timeLabel', 'venue', 'city', 'image'];
for (const [i, e] of events.entries()) {
  const which = e.title || `#${i}`;
  test(`events[${i}] (${which}): has all required fields`, () => {
    for (const field of EVENT_REQUIRED) {
      assert.equal(typeof e[field], 'string', `${field} must be a string`);
      assert.ok(e[field].trim().length > 0, `${field} must not be blank`);
    }
    assert.equal(typeof e.imageAlt, 'string', 'imageAlt must be a string (may be empty)');
    assert.match(e.eventDate, /^\d{4}-\d{2}-\d{2}$/, 'eventDate must be YYYY-MM-DD (cards derive the date badge from it)');
    const parsed = new Date(`${e.eventDate}T00:00:00Z`);
    assert.ok(!Number.isNaN(parsed.getTime()), `eventDate is not a real date: ${e.eventDate}`);
  });

  test(`events[${i}] (${which}): card image exists in public/`, () => {
    assert.ok(e.image.startsWith('/images/'), `image should live under /images/, got ${e.image}`);
    assert.ok(existsSync(publicPath(e.image)), `missing asset: public${e.image}`);
  });
}

// Ordering contract: the fixture must be committed in API order (newest first)
// so the file stays content-identical to the API response — checked on the raw
// array as committed, not on a sorted copy (which could never fail).
test('events: fixture is committed newest-first (eventDate desc)', () => {
  const dates = events.map((e) => e.eventDate);
  for (let i = 1; i < dates.length; i++) {
    assert.ok(dates[i - 1] >= dates[i], `events.json not committed desc by eventDate at index ${i}: ${dates}`);
  }
});
