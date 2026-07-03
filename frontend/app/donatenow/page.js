import React from 'react';
import NavOne from "../../components/NavOne";
import PageHeader from "../../components/PageHeader";
import Footer from "../../components/Footer";
import Donate from "../../components/Donate";

export const metadata = { title: "Tombossa B Foundation | Donate Now" };

const DonateNowPage = () => {
    return (
        <>
            <NavOne />
            <PageHeader title="Donate Now" />
            <Donate />
            <Footer />
        </>
    );
};

export default DonateNowPage;
