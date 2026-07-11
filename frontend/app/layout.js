import React from 'react';
import { DonateProvider } from '../components/DonateProvider';

export const metadata = {
    metadataBase: new URL('https://tombossabfoundation.org'),
    title: 'Tombossa B Foundation',
    description: 'Empowering Eritrean and East African youth communities through education, support, and opportunity.',
    icons: { icon: '/images/favicon.png' },
    openGraph: {
        title: 'Tombossa B Foundation',
        description: 'Empowering Eritrean and East African youth communities through education, support, and opportunity.',
        url: 'https://tombossabfoundation.org/',
        type: 'website',
        images: ['/images/link-preview.png'],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Tombossa B Foundation',
        description: 'Empowering Eritrean and East African youth communities through education, support, and opportunity.',
        images: ['/images/link-preview.png'],
    },
};

// The site's styling is runtime CSS under public/ (relative url() references to
// fonts/images), NOT bundler CSS — do not convert these to imports. React 19
// hoists the links into <head>; a single shared `precedence` keeps them in
// source order, which is load-bearing (responsive.css overrides style.css,
// which overrides bootstrap).
const STYLESHEETS = [
    '/plugins/bootstrap/bootstrap.min.css',
    '/css/font-awesome.css',
    '/css/animate.min.css',
    '/css/fontello.css',
    '/plugins/accordion.css',
    '/plugins/glightbox.min.css',
    '/css/style.css',
    '/css/responsive.css',
];

// One stylesheet for all three families (Playfair Display, Poppins, Roboto).
const GOOGLE_FONTS = [
    'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap',
];

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <link rel="preconnect" href="https://donorbox.org" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                {STYLESHEETS.map((href) => (
                    <link key={href} rel="stylesheet" href={href} precedence="site" />
                ))}
                {GOOGLE_FONTS.map((href) => (
                    <link key={href} rel="stylesheet" href={href} precedence="site" />
                ))}

                {/* The single app-level donate modal persists across client-side
                    navigation so a donor's in-progress form is never lost. */}
                <DonateProvider>{children}</DonateProvider>

                {/* Classic sync scripts, exactly as the old Layout rendered them:
                    they execute during document parse — before hydration — so the
                    Accordion/GLightbox globals exist when components mount. */}
                <script src="/plugins/accordion.min.js"></script>
                <script src="/plugins/glightbox.min.js"></script>
            </body>
        </html>
    );
}
