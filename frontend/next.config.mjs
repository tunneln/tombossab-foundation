// A Vercel production build without the API URLs would still succeed, but
// every form would POST to the visitor's localhost and pages would serve the
// committed fixtures. Fail that build instead. (CI, local builds, and Vercel
// previews deliberately run without them.)
if (process.env.VERCEL_ENV === 'production') {
    const missing = ['API_BASE_URL', 'NEXT_PUBLIC_API_BASE_URL'].filter((name) => !process.env[name]);
    if (missing.length) {
        throw new Error(`Production build is missing ${missing.join(' and ')} (Vercel project env, Production scope).`);
    }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        // Legacy URLs, carried over from the old backend HtmlController 301s.
        return [
            {
                source: '/coffee-women-empowerment',
                destination: '/events/coffee-women-empowerment-1',
                permanent: true,
            },
            {
                source: '/events-detail',
                destination: '/events/coffee-women-empowerment-1',
                permanent: true,
            },
            // The gala's canonical URL is /gala (printed on flyers and QR codes);
            // the gala has no /events/[slug] page of its own.
            {
                source: '/events/gala-2026',
                destination: '/gala',
                permanent: true,
            },
            // The old site also answered every page at its exported file name
            // (/about.html, /events/<slug>.html); keep shared and indexed links working.
            {
                source: '/index.html',
                destination: '/',
                permanent: true,
            },
            {
                source: '/:path(.+)\\.html',
                destination: '/:path',
                permanent: true,
            },
        ];
    },
};

export default nextConfig;
