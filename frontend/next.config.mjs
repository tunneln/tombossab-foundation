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
        ];
    },
};

export default nextConfig;
