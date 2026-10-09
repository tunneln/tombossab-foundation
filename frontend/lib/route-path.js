import { usePathname } from 'next/navigation';

// The current route, for anything that decides what gets rendered. Read it
// through here, never usePathname() directly (pinned by render.test.mjs): when
// Vercel regenerates the home page (ISR) it renders it as "/index" while the
// browser and the build see "/", and hydration doesn't repair markup that
// differs, so a home-page check on the raw value ships the wrong HTML.
export const normalizeRoute = (pathname) => (pathname === '/index' ? '/' : pathname);

export const useRoutePath = () => normalizeRoute(usePathname());
