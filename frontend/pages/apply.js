import React from 'react';
import Layout from "../components/Layout";
import NavOne from "../components/NavOne";
import PageHeader from "../components/PageHeader";
import ApplyArea from "../components/ApplyArea";
import Map from "../components/Map";
import Footer from "../components/Footer";

const ApplyPage = () => {
    return (
        <Layout pageTitle="Tombossa B Foundation | Scholarship Program">
            <NavOne />
            <PageHeader title="Scholarship Program" />
            <ApplyArea />
            <Map /> 
            <Footer />
        </Layout>
    );
};

export default ApplyPage;