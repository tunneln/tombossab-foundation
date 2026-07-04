// Client-safe config (imported by "use client" components).
// NEXT_PUBLIC_ vars are inlined at build time; Vercel sets the production value.
// The fallback keeps local dev and the offline test suite working with zero
// setup (tests intercept the request before any connection is attempted).
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

// Shared POST for the engagement forms (contact, volunteer, subscribe). Sends
// structured JSON and throws on a non-2xx so callers show their own message.
export async function postJson(path, body) {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error(`Error: ${response.statusText}`);
    return response;
}
