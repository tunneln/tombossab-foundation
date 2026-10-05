import React from 'react';
import NavOne from "../../components/NavOne";
import Footer from "../../components/Footer";
import GalaHero from "../../components/gala/GalaHero";
import GalaStory from "../../components/gala/GalaStory";
import GalaEvening from "../../components/gala/GalaEvening";
import GalaScholars from "../../components/gala/GalaScholars";
import GalaTickets from "../../components/gala/GalaTickets";
import GalaSponsor from "../../components/gala/GalaSponsor";
import GalaGive from "../../components/gala/GalaGive";
import GalaFaq from "../../components/gala/GalaFaq";
import GalaShare from "../../components/gala/GalaShare";
import StickyCta from "../../components/gala/StickyCta";
import RevealOnScroll from "../../components/gala/RevealOnScroll";
import DevChecklist from "../../components/gala/DevChecklist";
import styles from "../../components/gala/Gala.module.css";
import { gala } from '../../config/gala-2026';
import { eventJsonLd, GALA_META, getGalaState } from '../../lib/gala';
import { getRecipients } from '../../lib/api';

// /gala is the canonical, printed URL (flyers, QR codes): never rename it.
// Its own Open Graph/Twitter objects replace the root layout's wholesale, so
// every share tag below is specific to this page (and absolute).
export const metadata = {
    title: GALA_META.title,
    description: GALA_META.description,
    alternates: { canonical: gala.canonicalUrl },
    openGraph: {
        title: GALA_META.shareTitle,
        description: GALA_META.description,
        url: gala.canonicalUrl,
        type: 'website',
        siteName: 'Tombossa B Foundation',
        images: [{ url: GALA_META.image, width: 1200, height: 630, alt: GALA_META.imageAlt }],
    },
    twitter: {
        card: 'summary_large_image',
        title: GALA_META.shareTitle,
        description: GALA_META.description,
        images: [{ url: GALA_META.image, alt: GALA_META.imageAlt }],
    },
};

const GalaPage = async () => {
    const recipients = await getRecipients();
    // Offer availability reflects the state as of this render (refreshed hourly).
    const jsonLd = eventJsonLd(getGalaState());
    return (
        <>
            <NavOne />
            {/* Gala state comes from the app-wide GalaStateProvider (root layout). */}
            <main className={styles.gala}>
                <GalaHero />
                <GalaStory />
                <GalaEvening />
                <GalaScholars recipients={recipients} />
                <GalaTickets />
                <GalaGive />
                <GalaSponsor />
                <GalaFaq />
                <GalaShare />
                <StickyCta />
                <DevChecklist />
            </main>
            <RevealOnScroll />
            <Footer />
            {jsonLd && (
                <script
                    type="application/ld+json"
                    // Escape "<" so the JSON can never close the script tag early.
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
                />
            )}
        </>
    );
};

export default GalaPage;
