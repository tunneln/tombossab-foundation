import React from 'react';
import Layout from "../components/Layout";
import NavOne from "../components/NavOne";
import PageHeader from "../components/PageHeader";
import Footer from "../components/Footer";
import CoffeeEventDetail from "../components/CoffeeEventDetail";

const CoffeeWomenEmpowermentPage = () => {
    return (
        <Layout pageTitle="Tombossa B Foundation | Coffee & Women Empowerment">
            <NavOne />
            {/* Need to fix mobile banner overflow before implementing this */}
            <PageHeader link="/events" title="Coffee & Women Empowerment" />
            <CoffeeEventDetail />
            <Footer />
        </Layout>
    );
};

export default CoffeeWomenEmpowermentPage;
