import React from 'react';
import Layout from "../components/Layout";
import NavOne from "../components/NavOne";
import PageHeader from "../components/PageHeader";
import Footer from "../components/Footer";
import Events from "../components/Events";
import PastEvents from "../components/PastEvents";

const EventsPage = () => {
    return (
        <Layout pageTitle="Tombossa B Foundation | Event">
            <NavOne />
            <PageHeader title="Events" />
            <Events />
            <PastEvents />
            <Footer />
        </Layout>
    );
};

export default EventsPage;
