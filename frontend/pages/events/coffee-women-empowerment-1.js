import React from 'react';
import Layout from "../../components/Layout";
import NavOne from "../../components/NavOne";
import PageHeader from "../../components/PageHeader";
import Footer from "../../components/Footer";
import CoffeeWomenEmpowermentEventDetail from "../../components/CoffeeWomenEmpowermentEventDetail";

const CoffeeWomenEmpowermentPage = () => {
    return (
        <Layout pageTitle="Tombossa B Foundation | Events | Coffee & Women Empowerment">
            <NavOne />
            <PageHeader link="/events" prev="Events" title="Coffee & Women Empowerment" />
            <CoffeeWomenEmpowermentEventDetail />
            <Footer />
        </Layout>
    );
};

export default CoffeeWomenEmpowermentPage;
