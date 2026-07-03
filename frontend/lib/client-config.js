// Client-safe config (imported by "use client" components).
// NEXT_PUBLIC_ vars are inlined at build time; Vercel sets the production value.
// The fallback keeps local dev and the offline test suite working with zero
// setup (tests intercept the request before any connection is attempted).
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
