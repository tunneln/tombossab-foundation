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
        ];
    },
};

export default nextConfig;
