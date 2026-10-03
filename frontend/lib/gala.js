// Pure helpers for the gala (config/gala-2026.js). No React, no browser APIs:
// everything here is importable from server components, client components,
// and the node:test suite (hence the explicit .js extensions).
//
// Every helper takes the config as an optional last argument so tests can feed
// variants (FMV values set, venue confirmed, ...) without touching the real file.
import { gala as GALA } from '../config/gala-2026.js';

export const GALA_STATES = ['coming_soon', 'on_sale', 'online_closed', 'past'];

const CONTACT_EMAIL = 'contact@tombossabfoundation.org';

// ---------------------------------------------------------------- formatting

// $55, $1,000 (whole dollars, no cents).
export const formatPrice = (amount) =>
    `$${amount.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;

const zoned = (iso, options, g = GALA) =>
    new Intl.DateTimeFormat('en-US', { timeZone: g.timezone, ...options }).format(new Date(iso));

// "6:00 PM"
export const formatTime = (iso, g = GALA) =>
    zoned(iso, { hour: 'numeric', minute: '2-digit' }, g);

// "Monday, November 23"
export const formatWeekdayDate = (iso, g = GALA) =>
    zoned(iso, { weekday: 'long', month: 'long', day: 'numeric' }, g);

// The start time is published only once confirmed (startAt alone still drives
// the countdown and state logic).
export const timePublished = (g = GALA) => Boolean(g.startAt && g.startTimeConfirmed);

// Hero chip: "5:00 PM" or "5:00 PM – 10:00 PM"; null while unconfirmed.
export const timeRange = (g = GALA) => {
    if (!timePublished(g)) return null;
    return g.endAt ? `${formatTime(g.startAt, g)} – ${formatTime(g.endAt, g)}` : formatTime(g.startAt, g);
};

// /events card, matching the existing cards' "2:00pm to 6:00pm" style.
export const cardTimeLabel = (g = GALA) => {
    if (!timePublished(g)) return 'Time TBA';
    const short = (iso) => formatTime(iso, g).replace(' ', '').toLowerCase();
    return g.endAt ? `${short(g.startAt)} to ${short(g.endAt)}` : short(g.startAt);
};

export const hasVenue = (g = GALA) => Boolean(g.venue.name);

// The name for display in headings: a non-breaking space keeps "Tombossa B"
// on one line, so wrapping never strands the "B".
export const displayName = (g = GALA) => g.name.replace('Tombossa B', 'Tombossa\u00a0B');

// "Dallas, TX" (or null)
export const venueCity = (g = GALA) =>
    g.venue.city ? `${g.venue.city}, ${g.venue.region}` : null;

// One-line full address for maps/calendars: "Name, 1 Main St, Dallas, TX 75201".
export const venueAddress = (g = GALA) => {
    if (!hasVenue(g)) return null;
    const { name, street, city, region, postalCode } = g.venue;
    const cityLine = [city && `${city}, ${region}`, postalCode].filter(Boolean).join(' ');
    return [name, street, cityLine].filter(Boolean).join(', ');
};

// ---------------------------------------------------------------- state

const CST_END_OF_DAY = 'T23:59:00-06:00';

// When the evening is over: endAt, or 11:59 PM CST on the event date.
export const galaEndsAt = (g = GALA) => new Date(g.endAt ?? `${g.eventDate}${CST_END_OF_DAY}`);

// Platform-specific behavior, keyed off checkout.provider. Switching platforms
// is a config change only: set the provider and paste its URLs.
export const PROVIDERS = {
    donorbox: { name: 'Donorbox', tipFaq: false, embedMinHeight: 900 },
    zeffy: { name: 'Zeffy', tipFaq: true, embedMinHeight: 1100 },
};
export const providerInfo = (g = GALA) => PROVIDERS[g.checkout.provider] ?? null;

// 'embed' (iframe + fallback link), 'link' (hosted page), or null (not set up yet).
export const checkoutMode = (g = GALA) => {
    if (g.checkout.tickets.embedSrc) return 'embed';
    if (g.checkout.tickets.hostedUrl) return 'link';
    return null;
};

// The state rendered at build time, before the client knows the real date.
// Stable across server and first client render, so hydration never mismatches.
export const defaultGalaState = (g = GALA) => (checkoutMode(g) ? 'on_sale' : 'coming_soon');

export const getGalaState = (now = new Date(), g = GALA) => {
    const t = now.getTime();
    if (t > galaEndsAt(g).getTime()) return 'past';
    if (g.sales.onlineCloseAt && t > new Date(g.sales.onlineCloseAt).getTime()) return 'online_closed';
    if (!checkoutMode(g)) return 'coming_soon';
    if (g.sales.openAt && t < new Date(g.sales.openAt).getTime()) return 'coming_soon';
    return 'on_sale';
};

// Dev-only `?galaState=past` override. Returns null in production builds
// (NODE_ENV is inlined at build time, so this compiles away).
export const stateOverride = (search) => {
    if (process.env.NODE_ENV === 'production') return null;
    const value = new URLSearchParams(search).get('galaState');
    return GALA_STATES.includes(value) ? value : null;
};

// Dev-only `?galaNow=2026-12-03T12:00:00-06:00`: pretend it's that moment
// (state, countdown, Giving Tuesday line, slide removal). Null in production.
export const nowOverride = (search) => {
    if (process.env.NODE_ENV === 'production') return null;
    const value = new URLSearchParams(search).get('galaNow');
    const date = value ? new Date(value) : null;
    return date && !Number.isNaN(date.getTime()) ? date : null;
};

// The homepage slide lives until homeSlide.removeAfter.
export const isAfter = (iso, now = new Date()) => now.getTime() > new Date(iso).getTime();

// Whole calendar days (Central time) from `now` until the event date.
export const daysUntil = (now = new Date(), g = GALA) => {
    const today = new Intl.DateTimeFormat('en-CA', { timeZone: g.timezone }).format(now);
    return Math.round((Date.parse(g.eventDate) - Date.parse(today)) / 86_400_000);
};

export const countdownLabel = (days) => {
    if (days > 1) return `${days} days to go`;
    if (days === 1) return '1 day to go';
    if (days === 0) return 'Tonight';
    return null;
};

// ---------------------------------------------------------------- tiers & money

// Estimated tax-deductible amount, or null when the FMV isn't set (UI hides it).
//  individual tier: price - FMV per guest
//  sponsor tier:    price - seats * FMV per guest of its seat type
// Clamped at 0: a Student & Youth ticket's FMV may exceed its price.
export const tierDeductible = (tier, g = GALA) => {
    const key = tier.fmvKey ?? tier.seatType;
    const fmv = g.fmvPerGuest[key];
    if (fmv == null) return null;
    const value = tier.seats ? tier.seats * fmv : fmv;
    return Math.max(0, tier.price - value);
};

export const minTicketPrice = (g = GALA) => Math.min(...g.tiers.attend.map((t) => t.price));

// { remaining, soldOut } for a limited tier (Scholarship Sponsor); null if unlimited.
export const tierAvailability = (tier) => {
    if (!tier.limit) return null;
    const remaining = Math.max(0, tier.limit - (tier.claimed ?? 0));
    return { remaining, soldOut: remaining === 0 };
};

export const sponsorshipHref = (g = GALA) =>
    g.checkout.sponsorship.hostedUrl
    ?? g.checkout.tickets.hostedUrl
    ?? `mailto:${CONTACT_EMAIL}?subject=Gala%202026%20Sponsorship`;

export const goalIsSet = (g = GALA) => Boolean(g.goal.headline && g.goal.amountGoal);

// ---------------------------------------------------------------- calendar

// A calendar entry needs a confirmed start time and a venue. Without endAt the
// entry is start-only (valid iCalendar): we never guess how long the night runs.
export const calendarReady = (g = GALA) => Boolean(timePublished(g) && hasVenue(g));

// 20261129T000000Z
const utcStamp = (date) => date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

const calendarDetails = (g = GALA) => `Tickets and details: ${g.canonicalUrl}`;

export const googleCalendarUrl = (g = GALA) => {
    if (!calendarReady(g)) return null;
    const params = new URLSearchParams({
        action: 'TEMPLATE',
        text: `${g.name} ${g.year}`,
        dates: `${utcStamp(new Date(g.startAt))}/${utcStamp(new Date(g.endAt ?? g.startAt))}`,
        details: calendarDetails(g),
        location: venueAddress(g),
        ctz: g.timezone,
    });
    return `https://calendar.google.com/calendar/render?${params}`;
};

const icsEscape = (text) =>
    text.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');

// RFC 5545 lines are folded at 75 octets (continuations start with a space).
const icsFold = (line) => {
    const out = [];
    let rest = line;
    while (rest.length > 75) {
        out.push(rest.slice(0, 75));
        rest = ` ${rest.slice(75)}`;
    }
    out.push(rest);
    return out.join('\r\n');
};

// A one-event .ics with UTC (Z) times, so every calendar app converts it to the
// viewer's local time correctly (6:00 PM CST stays 6:00 PM in America/Chicago).
export const icsContent = (now = new Date(), g = GALA) => {
    if (!calendarReady(g)) return null;
    const lines = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Tombossa B Foundation//Gala 2026//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'BEGIN:VEVENT',
        `UID:gala-${g.year}@tombossabfoundation.org`,
        `DTSTAMP:${utcStamp(now)}`,
        `DTSTART:${utcStamp(new Date(g.startAt))}`,
        ...(g.endAt ? [`DTEND:${utcStamp(new Date(g.endAt))}`] : []),
        `SUMMARY:${icsEscape(`${g.name} ${g.year}`)}`,
        `LOCATION:${icsEscape(venueAddress(g))}`,
        `DESCRIPTION:${icsEscape(calendarDetails(g))}`,
        `URL:${g.canonicalUrl}`,
        'END:VEVENT',
        'END:VCALENDAR',
    ];
    return `${lines.map(icsFold).join('\r\n')}\r\n`;
};

// ---------------------------------------------------------------- sharing

export const shareLinks = (g = GALA) => {
    const text = g.copy.shareText;
    const url = g.canonicalUrl;
    const enc = encodeURIComponent;
    return {
        text,
        url,
        whatsapp: `https://wa.me/?text=${enc(`${text} ${url}`)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`,
        x: `https://x.com/intent/post?text=${enc(text)}&url=${enc(url)}`,
        email: `mailto:?subject=${enc(`${g.name} ${g.year}`)}&body=${enc(`${text}\n\n${url}`)}`,
    };
};

// ---------------------------------------------------------------- structured data

const OFFER_AVAILABILITY = {
    coming_soon: 'https://schema.org/PreOrder',
    on_sale: 'https://schema.org/InStock',
    online_closed: 'https://schema.org/SoldOut',
    past: 'https://schema.org/SoldOut',
};

// schema.org Event, or null until there's a confirmed time and a venue (Google
// requires a location). Offers' availability reflects the build-time default state.
export const eventJsonLd = (state = defaultGalaState(), g = GALA) => {
    if (!timePublished(g) || !hasVenue(g)) return null;
    const { name, street, city, region, postalCode } = g.venue;
    const address = {
        '@type': 'PostalAddress',
        ...(street && { streetAddress: street }),
        ...(city && { addressLocality: city }),
        addressRegion: region,
        ...(postalCode && { postalCode }),
        addressCountry: 'US',
    };
    return {
        '@context': 'https://schema.org',
        '@type': 'Event',
        name: `${g.name} ${g.year}`,
        description: GALA_META.description,
        image: [GALA_META.image],
        startDate: g.startAt,
        ...(g.endAt && { endDate: g.endAt }),
        eventStatus: 'https://schema.org/EventScheduled',
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        location: { '@type': 'Place', name, address },
        organizer: { '@type': 'Organization', name: 'Tombossa B Foundation', url: 'https://tombossabfoundation.org' },
        offers: g.tiers.attend.map((tier) => ({
            '@type': 'Offer',
            name: tier.name,
            price: tier.price,
            priceCurrency: 'USD',
            availability: OFFER_AVAILABILITY[state],
            url: g.canonicalUrl,
            ...(g.sales.openAt && { validFrom: g.sales.openAt }),
        })),
    };
};

// Link-preview copy for /gala (app/gala/page.js metadata and the JSON-LD).
export const GALA_META = {
    title: 'Tombossa B Foundation | Gala 2026 | Tickets & Sponsorship',
    shareTitle: 'The Tombossa B Foundation Fundraising Gala · November 28, 2026',
    description:
        'Dinner, music, a silent auction, and inspiring speakers — Saturday, November 28, 2026. Every ticket funds scholarships for Eritrean and East African youth.',
    image: 'https://tombossabfoundation.org/images/gala-2026-og.png',
    imageAlt: 'The Tombossa B Foundation Fundraising Gala, Saturday, November 28, 2026, at tombossabfoundation.org/gala',
};

// ---------------------------------------------------------------- launch checklist

// Every TODO_CONFIRM in config/gala-2026.js, by path (scripts/gala.test.mjs keeps
// this in sync with the comments). The dev-only panel on /gala lists them.
export const CONFIRM_FIELDS = [
    'endAt',
    'copy.intro.1',
    'sales.doorSalesAvailable',
    'fmvPerGuest.standard', 'fmvPerGuest.champion',
    'goal.headline', 'goal.amountGoal',
    'tiers.attend.2.includes.2', 'tiers.sponsor.2.benefits.1',
    'tiers.give.programListing.deadline',
    'sponsorship.logoDeadline', 'sponsorship.packetPdf',
    'checkout.provider', 'checkout.tickets', 'checkout.donate.future-scholar',
    'program.schedule', 'program.speakers', 'program.music', 'program.dinnerNote',
    'faq.parking', 'faq.ages', 'faq.refunds', 'faq.dietary', 'faq.studentEligibility',
    'faq.auction', 'faq.accessibility',
];

export const getPath = (obj, path) => path.split('.').reduce((node, key) => node?.[key], obj);

const isUnset = (value) =>
    value == null
    || value === false
    || (Array.isArray(value) && value.length === 0)
    || (typeof value === 'object' && !Array.isArray(value) && Object.values(value).every((v) => v == null));

// [{ path, unset }]: unset = still null/empty (hidden or falling back on the
// page); otherwise it has a proposed value that still needs sign-off.
export const confirmChecklist = (g = GALA) =>
    CONFIRM_FIELDS.map((path) => ({ path, unset: isUnset(getPath(g, path)) }));
