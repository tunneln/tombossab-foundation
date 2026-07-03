import React from 'react';
import NavOne from "../../components/NavOne";
import PageHeader from "../../components/PageHeader";
import Footer from "../../components/Footer";
import Sponsor from "../../components/Sponsor";

export const metadata = { title: "Tombossa B Foundation | Sponsors" };

const SponsorPage = () => {
    return (
        <>
            <NavOne />
            <PageHeader title="Sponsors" />
            <Sponsor />
            <Footer />
        </>
    );
};

export default SponsorPage;
