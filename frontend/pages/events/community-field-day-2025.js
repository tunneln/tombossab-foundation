import React from 'react';
import Layout from "../../components/Layout";
import NavOne from "../../components/NavOne";
import PageHeader from "../../components/PageHeader";
import Footer from "../../components/Footer";
import CommunityFieldDay2025EventDetail from "../../components/CommunityFieldDay2025EventDetail";

const CommunityFieldDay2025Page = () => {
    return (
        <Layout pageTitle="Tombossa B Foundation | Events | Community Field Day">
            <NavOne />
            <PageHeader prev="Events" link="/events" title="Community Field Day" />
            <CommunityFieldDay2025EventDetail />
            <Footer />
        </Layout>
    );
};

export default CommunityFieldDay2025Page;
