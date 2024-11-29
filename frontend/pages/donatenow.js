import React from 'react';
import Layout from "../components/Layout";
import NavOne from "../components/NavOne";
import PageHeader from "../components/PageHeader";
import Footer from "../components/Footer";
import Donate from "../components/Donate";

const DonateNowPage = () => {
    return (
        <Layout pageTitle="Tombossa B Foundation | Donate Now">
            <NavOne />
            <PageHeader title="Donate Now" />
            <Donate />
            <Footer />
        </Layout>
    );
};

export default DonateNowPage;
