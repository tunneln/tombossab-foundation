import 'server-only';
import recipientsFixture from '../data/recipients.json';
import newslettersFixture from '../data/newsletters.json';
import eventsFixture from '../data/events.json';

// Content access with a hermetic fallback:
//  - API_BASE_URL set (Vercel prod)  -> fetch from the backend with ISR caching;
//    a fetch failure falls back to the committed fixture so a backend blip can
//    never break a build or a revalidation.
//  - API_BASE_URL unset (CI, tests, local dev without a backend) -> pure
//    fixture rendering: offline, deterministic, byte-stable.
// Content rule: every Flyway seed migration updates its fixture in the same PR,
// so the fallback is never stale.

const BASE = process.env.API_BASE_URL;

async function fromApi(path, tag) {
    const res = await fetch(`${BASE}${path}`, {
        next: { revalidate: 3600, tags: ['content', tag] },
        // Bound the wait so a hung (accepting-but-silent) backend can't stall a
        // build or revalidation — a timeout throws and getContent() falls back
        // to the committed fixture.
        signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) throw new Error(`GET ${path} -> ${res.status}`);
    return res.json();
}

// Sort fixtures exactly like the API does, so both sources render identically.
const sortRecipients = (list) =>
    [...list].sort((a, b) => Number(b.year) - Number(a.year)); // stable: seed order within a year
const sortNewsletters = (list) =>
    [...list].sort((a, b) => b.date.localeCompare(a.date));
const sortEvents = (list) =>
    [...list].sort((a, b) => b.eventDate.localeCompare(a.eventDate));

async function getContent(path, tag, fixture, sortFixture) {
    if (!BASE) return sortFixture(fixture);
    try {
        return await fromApi(path, tag);
    } catch (err) {
        console.error(`[lib/api] ${path} unreachable, serving committed fixture:`, err);
        return sortFixture(fixture);
    }
}

export const getRecipients = () =>
    getContent('/api/recipients', 'recipients', recipientsFixture, sortRecipients);
export const getNewsletters = () =>
    getContent('/api/newsletters', 'newsletters', newslettersFixture, sortNewsletters);
export const getEvents = () =>
    getContent('/api/events', 'events', eventsFixture, sortEvents);
