import React from 'react';
import Layout from "../components/Layout";
import NavOne from "../components/NavOne";
import PageHeader from "../components/PageHeader";
import Footer from "../components/Footer";
import EventsSection from "../components/EventsSection";

const EventsPage = () => {
    return (
        <Layout pageTitle="Tombossa B Foundation | Event">
            <NavOne />
            <PageHeader title="Events" />
            <EventsSection />
            <Footer />
        </Layout>
    );
};

export default EventsPage;
