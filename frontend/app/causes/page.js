import React from 'react';
import NavOne from "../../components/NavOne";
import PageHeader from "../../components/PageHeader";
import Causes from "../../components/Causes";
import Footer from "../../components/Footer";

export const metadata = { title: "Tombossa B Foundation | Causes" };

const CausesPage = () => {
    return (
        <>
            <NavOne />
            <PageHeader title="Causes" />
            <Causes />
            <Footer />
        </>
    );
};

export default CausesPage;
