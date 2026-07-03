import React from 'react';
import NavOne from "../../components/NavOne";
import PageHeader from "../../components/PageHeader";
import ApplyArea from "../../components/ApplyArea";
import Map from "../../components/Map";
import Footer from "../../components/Footer";

export const metadata = { title: "Tombossa B Foundation | Scholarship | Application" };

const ApplyPage = () => {
    return (
        <>
            <NavOne />
            <PageHeader title="Scholarship Application" />
            <ApplyArea />
            <Map />
            <Footer />
        </>
    );
};

export default ApplyPage;
