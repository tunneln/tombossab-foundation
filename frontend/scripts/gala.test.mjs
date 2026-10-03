// Unit tests for the gala helpers (lib/gala.js) and config (config/gala-2026.js).
// Pure functions — no build or server needed.
//
//   node --test scripts/gala.test.mjs      (or: npm test)
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { gala } from '../config/gala-2026.js';
import {
    getGalaState, defaultGalaState, checkoutMode, tierDeductible, tierAvailability,
    sponsorshipHref, minTicketPrice, formatPrice, formatTime, formatWeekdayDate, timeRange, cardTimeLabel,
    daysUntil, countdownLabel, googleCalendarUrl, icsContent, eventJsonLd, shareLinks,
    venueAddress, CONFIRM_FIELDS, confirmChecklist, getPath, GALA_META, providerInfo, timePublished,
} from '../lib/gala.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONFIG_SRC = readFileSync(path.resolve(__dirname, '../config/gala-2026.js'), 'utf8');

// A deep copy of the real config with overrides merged in (one level deep per key).
const variant = (overrides = {}) => {
    const g = structuredClone(gala);
    for (const [key, value] of Object.entries(overrides)) {
        g[key] = value && typeof value === 'object' && !Array.isArray(value) ? { ...g[key], ...value } : value;
    }
    return g;
};
const withCheckout = (tickets) => variant({ checkout: { ...gala.checkout, tickets } });
const at = (iso) => new Date(iso);

const LINK = { hostedUrl: 'https://example.org/tickets', embedSrc: null };
const EMBED = { hostedUrl: 'https://example.org/tickets', embedSrc: 'https://example.org/embed' };
const CONFIRMED = {
    startTimeConfirmed: true,
    startAt: '2026-11-28T18:00:00-06:00',
    endAt: '2026-11-28T22:00:00-06:00',
    venue: { name: 'Test Hall', street: '1 Main St', city: 'Dallas', region: 'TX', postalCode: '75201' },
};

// ------------------------------------------------------------------ config

test('config: event facts match the spec', () => {
    assert.equal(gala.canonicalUrl, 'https://tombossabfoundation.org/gala');
    assert.equal(gala.dateDisplay, 'Saturday, November 28, 2026');
    assert.equal(gala.eventDate, '2026-11-28');
    assert.equal(gala.timezone, 'America/Chicago');
    assert.deepEqual(gala.venue, {
        name: 'Empire Event Center', street: '9560 Skillman St, Suite 126',
        city: 'Dallas', region: 'TX', postalCode: '75243',
    });
    assert.equal(gala.startAt, '2026-11-28T17:00:00-06:00');
    assert.deepEqual(gala.tiers.attend.map((t) => [t.id, t.price, t.doorPrice]),
        [['student', 30, 40], ['ga', 55, 65], ['champion', 85, 95]]);
    assert.deepEqual(gala.tiers.sponsor.map((t) => [t.id, t.price, t.seats]),
        [['community', 500, 5], ['legacy', 1000, 8], ['scholarship', 2500, 8]]);
});

test('config: every timestamp carries the CST -06:00 offset', () => {
    const stamps = CONFIG_SRC.match(/'\d{4}-\d{2}-\d{2}T[^']+'/g) ?? [];
    assert.ok(stamps.length > 0);
    for (const s of stamps) assert.match(s, /-06:00'$/, `${s} must use -06:00`);
});

test('config: CONFIRM_FIELDS matches the TODO_CONFIRM comments and every path resolves', () => {
    // Count code lines carrying a TODO_CONFIRM (not the header comment block).
    const marked = CONFIG_SRC.split('\n').filter((l) => /\S.*\/\/ TODO_CONFIRM/.test(l) && !/^\s*\/\//.test(l));
    assert.equal(CONFIRM_FIELDS.length, marked.length,
        'add/remove the matching CONFIRM_FIELDS path in lib/gala.js when a TODO_CONFIRM changes');
    for (const p of CONFIRM_FIELDS) {
        assert.notEqual(getPath(gala, p), undefined, `CONFIRM_FIELDS path does not exist: ${p}`);
    }
});

test('checklist: unset fields are reported, proposed values are not "unset"', () => {
    const byPath = Object.fromEntries(confirmChecklist().map((i) => [i.path, i.unset]));
    assert.equal(byPath.endAt, true);
    assert.equal(byPath['checkout.provider'], false);
    assert.equal(byPath['checkout.tickets'], true);
    assert.equal(byPath['program.speakers'], true);
    assert.equal(byPath['faq.refunds'], false);
});

// ------------------------------------------------------------------ state

test('state: default render state follows checkout configuration', () => {
    assert.equal(defaultGalaState(gala), 'coming_soon');
    assert.equal(defaultGalaState(withCheckout(LINK)), 'on_sale');
});

test('state: coming_soon until a checkout link exists', () => {
    assert.equal(checkoutMode(gala), null);
    assert.equal(getGalaState(at('2026-10-02T12:00:00-05:00'), gala), 'coming_soon');
});

test('state: checkout mode prefers the embed', () => {
    assert.equal(checkoutMode(withCheckout(LINK)), 'link');
    assert.equal(checkoutMode(withCheckout(EMBED)), 'embed');
});

test('state: openAt holds sales back', () => {
    const g = withCheckout(LINK);
    g.sales.openAt = '2026-10-15T09:00:00-05:00';
    assert.equal(getGalaState(at('2026-10-15T08:59:00-05:00'), g), 'coming_soon');
    assert.equal(getGalaState(at('2026-10-15T09:01:00-05:00'), g), 'on_sale');
});

test('state: boundaries in Central time (online close at noon on gala day, end of night)', () => {
    const g = withCheckout(LINK);
    assert.equal(getGalaState(at('2026-11-28T11:59:00-06:00'), g), 'on_sale');
    assert.equal(getGalaState(at('2026-11-28T12:01:00-06:00'), g), 'online_closed');
    assert.equal(getGalaState(at('2026-11-28T23:58:00-06:00'), g), 'online_closed');
    // endAt null -> past after 11:59 PM CST on Nov 28 (= 05:59 UTC Nov 29)
    assert.equal(getGalaState(at('2026-11-29T06:00:00Z'), g), 'past');
});

test('state: endAt, when set, ends the night', () => {
    const g = variant({ ...CONFIRMED, checkout: { ...gala.checkout, tickets: LINK } });
    assert.equal(getGalaState(at('2026-11-28T21:59:00-06:00'), g), 'online_closed');
    assert.equal(getGalaState(at('2026-11-28T22:01:00-06:00'), g), 'past');
});

// ------------------------------------------------------------------ money

test('deductible: null while FMV is unset (UI hides the line)', () => {
    for (const tier of [...gala.tiers.attend, ...gala.tiers.sponsor]) {
        assert.equal(tierDeductible(tier, gala), null, tier.id);
    }
});

test('deductible: hand-checked against two FMV sets, never negative', () => {
    const [student, ga, champion] = gala.tiers.attend;
    const [community, legacy, scholarship] = gala.tiers.sponsor;

    // Set A: standard $35, champion $50
    const a = variant({ fmvPerGuest: { standard: 35, champion: 50 } });
    assert.equal(tierDeductible(student, a), 0);         // 30 - 35 -> clamped
    assert.equal(tierDeductible(ga, a), 20);             // 55 - 35
    assert.equal(tierDeductible(champion, a), 35);       // 85 - 50
    assert.equal(tierDeductible(community, a), 325);     // 500 - 5*35
    assert.equal(tierDeductible(legacy, a), 600);        // 1000 - 8*50
    assert.equal(tierDeductible(scholarship, a), 2100);  // 2500 - 8*50

    // Set B: standard $25, champion $40
    const b = variant({ fmvPerGuest: { standard: 25, champion: 40 } });
    assert.equal(tierDeductible(student, b), 5);         // 30 - 25
    assert.equal(tierDeductible(ga, b), 30);             // 55 - 25
    assert.equal(tierDeductible(champion, b), 45);       // 85 - 40
    assert.equal(tierDeductible(community, b), 375);     // 500 - 5*25
    assert.equal(tierDeductible(legacy, b), 680);        // 1000 - 8*40
    assert.equal(tierDeductible(scholarship, b), 2180);  // 2500 - 8*40

    // Absurd FMV still clamps at zero.
    const c = variant({ fmvPerGuest: { standard: 999, champion: 999 } });
    for (const tier of [...gala.tiers.attend, ...gala.tiers.sponsor]) {
        assert.equal(tierDeductible(tier, c), 0, tier.id);
    }
});

test('scholarship sponsor: claimed 0/1/2 -> 2 left / 1 left / sold out', () => {
    const tier = gala.tiers.sponsor.find((t) => t.id === 'scholarship');
    assert.deepEqual(tierAvailability({ ...tier, claimed: 0 }), { remaining: 2, soldOut: false });
    assert.deepEqual(tierAvailability({ ...tier, claimed: 1 }), { remaining: 1, soldOut: false });
    assert.deepEqual(tierAvailability({ ...tier, claimed: 2 }), { remaining: 0, soldOut: true });
    assert.equal(tierAvailability(gala.tiers.sponsor[0]), null, 'unlimited tiers have no availability');
});

test('sponsorship CTA: sponsorship link -> tickets link -> email', () => {
    assert.equal(sponsorshipHref(gala),
        'mailto:contact@tombossabfoundation.org?subject=Gala%202026%20Sponsorship');
    assert.equal(sponsorshipHref(withCheckout(LINK)), LINK.hostedUrl);
    const g = withCheckout(LINK);
    g.checkout.sponsorship.hostedUrl = 'https://example.org/sponsor';
    assert.equal(sponsorshipHref(g), 'https://example.org/sponsor');
});

test('formatting: prices, close date, minimum price', () => {
    assert.equal(formatPrice(55), '$55');
    assert.equal(formatPrice(2500), '$2,500');
    assert.equal(minTicketPrice(gala), 30);
    assert.equal(formatWeekdayDate(gala.sales.onlineCloseAt, gala), 'Saturday, November 28');
    assert.equal(formatTime(gala.sales.onlineCloseAt, gala), '12:00 PM');
});

test('formatting: a start time is published only once confirmed', () => {
    const tentative = variant({ startTimeConfirmed: false });
    assert.equal(timePublished(tentative), false);
    assert.equal(timeRange(tentative), null);
    assert.equal(cardTimeLabel(tentative), 'Time TBA');
    assert.equal(timePublished(gala), true, 'the real config has the 5 PM start confirmed');
    assert.equal(timeRange(gala), '5:00 PM');
    assert.equal(cardTimeLabel(gala), '5:00pm');
    const g = variant(CONFIRMED);
    assert.equal(timeRange(g), '6:00 PM – 10:00 PM');
    assert.equal(cardTimeLabel(g), '6:00pm to 10:00pm');
    assert.equal(venueAddress(g), 'Test Hall, 1 Main St, Dallas, TX 75201');
    assert.equal(venueAddress(gala), 'Empire Event Center, 9560 Skillman St, Suite 126, Dallas, TX 75243');
});

test('provider: platform behavior keys off checkout.provider alone', () => {
    assert.equal(providerInfo(gala).name, 'Donorbox');
    assert.equal(providerInfo(gala).tipFaq, false);
    const zeffy = variant({ checkout: { ...gala.checkout, provider: 'zeffy' } });
    assert.equal(providerInfo(zeffy).name, 'Zeffy');
    assert.equal(providerInfo(zeffy).tipFaq, true);
    assert.equal(providerInfo(variant({ checkout: { ...gala.checkout, provider: null } })), null);
});

test('countdown: calendar days in Central time', () => {
    assert.equal(daysUntil(at('2026-10-02T12:00:00-05:00'), gala), 57);
    // 11 PM CST on Nov 27 is already Nov 28 in UTC; still "1 day" in Dallas.
    assert.equal(daysUntil(at('2026-11-27T23:00:00-06:00'), gala), 1);
    assert.equal(countdownLabel(57), '57 days to go');
    assert.equal(countdownLabel(1), '1 day to go');
    assert.equal(countdownLabel(0), 'Tonight');
    assert.equal(countdownLabel(-1), null);
});

// ------------------------------------------------------------------ calendar & sharing

test('calendar: withheld while the start time is unconfirmed', () => {
    const tentative = variant({ startTimeConfirmed: false });
    assert.equal(googleCalendarUrl(tentative), null);
    assert.equal(icsContent(new Date(), tentative), null);
});

test('calendar: confirmed 5:00 PM CST, no endAt -> start-only entry at 23:00Z', () => {
    const g = gala;
    const ics = icsContent(at('2026-10-02T17:00:00Z'), g);
    assert.match(ics, /\r\nDTSTART:20261128T230000Z\r\n/);
    assert.doesNotMatch(ics, /DTEND/, 'never guess an end time');
    assert.match(ics, /LOCATION:Empire Event Center\\, 9560 Skillman St\\, Suite 126\\, Dallas\\, TX 7\r\n 5243/);
    assert.equal(new URL(googleCalendarUrl(g)).searchParams.get('dates'), '20261128T230000Z/20261128T230000Z');
});

test('calendar: .ics uses UTC times (6 PM CST = 00:00Z next day), CRLF, folded lines', () => {
    const ics = icsContent(at('2026-10-02T17:00:00Z'), variant(CONFIRMED));
    assert.match(ics, /\r\nDTSTART:20261129T000000Z\r\n/);
    assert.match(ics, /\r\nDTEND:20261129T040000Z\r\n/);
    assert.match(ics, /\r\nDTSTAMP:20261002T170000Z\r\n/);
    assert.match(ics, /\r\nLOCATION:Test Hall\\, 1 Main St\\, Dallas\\, TX 75201\r\n/);
    assert.doesNotMatch(ics, /DTSTART:\d{8}T\d{6}\r/, 'no floating times');
    for (const line of ics.split('\r\n')) assert.ok(line.length <= 75, `unfolded line: ${line}`);
    assert.ok(ics.endsWith('END:VCALENDAR\r\n'));
});

test('calendar: Google link carries UTC dates and the venue', () => {
    const url = new URL(googleCalendarUrl(variant(CONFIRMED)));
    assert.equal(url.searchParams.get('dates'), '20261129T000000Z/20261129T040000Z');
    assert.equal(url.searchParams.get('location'), 'Test Hall, 1 Main St, Dallas, TX 75201');
    assert.equal(url.searchParams.get('ctz'), 'America/Chicago');
});

test('share links encode the spec text and canonical URL', () => {
    const s = shareLinks(gala);
    assert.equal(s.text,
        'Join me at the Tombossa B Foundation Fundraising Gala on Saturday, November 28! Every ticket supports scholarships for Eritrean and East African youth.');
    assert.ok(s.whatsapp.startsWith('https://wa.me/?text='));
    assert.ok(decodeURIComponent(s.whatsapp).endsWith(' https://tombossabfoundation.org/gala'));
    assert.equal(s.facebook, 'https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Ftombossabfoundation.org%2Fgala');
    assert.ok(s.x.startsWith('https://x.com/intent/post?text='));
    assert.ok(s.email.startsWith('mailto:?subject='));
});

// ------------------------------------------------------------------ SEO

test('meta: description stays under 160 characters', () => {
    assert.ok(GALA_META.description.length < 160, `${GALA_META.description.length} chars`);
});

test('JSON-LD: absent while the start time is unconfirmed', () => {
    assert.equal(eventJsonLd('coming_soon', variant({ startTimeConfirmed: false })), null);
    const ld = eventJsonLd('coming_soon', gala);
    assert.equal(ld.startDate, '2026-11-28T17:00:00-06:00');
    assert.equal(ld.location.name, 'Empire Event Center');
    assert.equal(ld.location.address.streetAddress, '9560 Skillman St, Suite 126');
    assert.equal(ld.endDate, undefined, 'no endDate until endAt is set');
});

test('JSON-LD: a complete schema.org Event once confirmed', () => {
    const ld = eventJsonLd('on_sale', variant(CONFIRMED));
    assert.equal(ld['@type'], 'Event');
    assert.equal(ld.startDate, '2026-11-28T18:00:00-06:00');
    assert.equal(ld.endDate, '2026-11-28T22:00:00-06:00');
    assert.equal(ld.eventStatus, 'https://schema.org/EventScheduled');
    assert.equal(ld.eventAttendanceMode, 'https://schema.org/OfflineEventAttendanceMode');
    assert.equal(ld.location.name, 'Test Hall');
    assert.equal(ld.location.address.postalCode, '75201');
    assert.deepEqual(ld.offers.map((o) => [o.name, o.price, o.priceCurrency]),
        [['Student & Youth', 30, 'USD'], ['General Admission', 55, 'USD'], ['Champion', 85, 'USD']]);
    assert.ok(ld.offers.every((o) => o.availability === 'https://schema.org/InStock' && o.url === gala.canonicalUrl));
    assert.ok(ld.image[0].startsWith('https://'), 'absolute image URL');
});
