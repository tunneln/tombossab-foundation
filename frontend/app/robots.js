// Served at /robots.txt: everything is crawlable; points crawlers at the sitemap.
export default function robots() {
    return {
        rules: { userAgent: '*', allow: '/' },
        sitemap: 'https://tombossabfoundation.org/sitemap.xml',
    };
}
