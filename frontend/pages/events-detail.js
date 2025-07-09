import React from 'react';
import Layout from "../components/Layout";
import NavOne from "../components/NavOne";
import PageHeader from "../components/PageHeader";
import Footer from "../components/Footer";
import EventsDetail from "../components/EventsDetail";

const EventsDetailPage = () => {
    return (
        <Layout pageTitle="Tombossa B Foundation | Event Details">
            <NavOne />
            <PageHeader prev="Events" link="/events" title="Community Field Day" />
            <EventsDetail />
            <Footer />
        </Layout>
    );
};

export default EventsDetailPage;
