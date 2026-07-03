import React from 'react';
import { notFound } from 'next/navigation';
import NavOne from "../../../components/NavOne";
import PageHeader from "../../../components/PageHeader";
import Footer from "../../../components/Footer";
import CoffeeWomenEmpowermentEventDetail from "../../../components/CoffeeWomenEmpowermentEventDetail";
import CommunityFieldDay2025EventDetail from "../../../components/CommunityFieldDay2025EventDetail";
import { getEvents } from '../../../lib/api';

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

// Only slugs returned here are built; anything else 404s.
export const dynamicParams = false;

export async function generateStaticParams() {
    const events = await getEvents();
    return events.filter((event) => event.slug).map((event) => ({ slug: event.slug }));
}

export async function generateMetadata({ params }) {
    const { slug } = await params;
    return { title: DETAILS[slug]?.title };
}

const EventDetailPage = async ({ params }) => {
    const { slug } = await params;
    const detail = DETAILS[slug];
    if (!detail) notFound();
    const { Body } = detail;
    return (
        <>
            <NavOne />
            <PageHeader prev="Events" link="/events" title={detail.header} />
            <Body />
            <Footer />
        </>
    );
};

export default EventDetailPage;
