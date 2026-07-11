import React from 'react';
import NavOne from "../../../components/NavOne";
import PageHeader from "../../../components/PageHeader";
import Footer from "../../../components/Footer";
import CoffeeWomenEmpowermentEventDetail from "../../../components/CoffeeWomenEmpowermentEventDetail";
import CommunityFieldDay2025EventDetail from "../../../components/CommunityFieldDay2025EventDetail";

// Event detail bodies are rich hand-written sections, so each slug maps to its
// bespoke component. A new event with a detail page = one entry here + its
// detail component (plus the seed/fixture data).
const DETAILS = {
    'coffee-women-empowerment-1': {
        title: 'Tombossa B Foundation | Events | Coffee & Women Empowerment',
        header: 'Coffee & Women Empowerment',
        Body: CoffeeWomenEmpowermentEventDetail,
    },
    'community-field-day-2025': {
        title: 'Tombossa B Foundation | Events | Community Field Day',
        header: 'Community Field Day',
        Body: CommunityFieldDay2025EventDetail,
    },
};

// The registry is the single source of truth for which detail pages exist:
// only its slugs are built; anything else 404s.
export const dynamicParams = false;

export function generateStaticParams() {
    return Object.keys(DETAILS).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
    const { slug } = await params;
    return { title: DETAILS[slug]?.title };
}

const EventDetailPage = async ({ params }) => {
    const { slug } = await params;
    const { header, Body } = DETAILS[slug];
    return (
        <>
            <NavOne />
            <PageHeader prev="Events" link="/events" title={header} />
            <Body />
            <Footer />
        </>
    );
};

export default EventDetailPage;
