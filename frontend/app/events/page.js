import React from 'react';
import NavOne from "../../components/NavOne";
import PageHeader from "../../components/PageHeader";
import Footer from "../../components/Footer";
import EventsSection from "../../components/EventsSection";
import { getEvents } from '../../lib/api';

export const metadata = { title: "Tombossa B Foundation | Event" };

const EventsPage = async () => {
    const events = await getEvents();
    return (
        <>
            <NavOne />
            <PageHeader title="Events" />
            <EventsSection events={events} />
            <Footer />
        </>
    );
};

export default EventsPage;
