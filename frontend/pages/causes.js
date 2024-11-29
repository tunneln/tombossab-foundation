import React from 'react';
import Layout from "../components/Layout";
import NavOne from "../components/NavOne";
import PageHeader from "../components/PageHeader";
import LatestCauses from "../components/LatestCauses";
import PastCauses from "../components/PastCauses";
import Footer from "../components/Footer";

const CausesPage = () => {
    return (
        <Layout pageTitle="Tombossa B Foundation | Causes">
            <NavOne />
            <PageHeader title="Causes" />
            <LatestCauses />
            <PastCauses />
            <Footer />
        </Layout>
    );
};

export default CausesPage;
