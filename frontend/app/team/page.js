import React from 'react';
import NavOne from "../../components/NavOne";
import PageHeader from "../../components/PageHeader";
import Footer from "../../components/Footer";
import Team from "../../components/Team";

export const metadata = { title: "Tombossa B Foundation | Team" };

const TeamPage = () => {
    return (
        <>
            <NavOne />
            <PageHeader title="Our Team" />
            <Team />
            <Footer />
        </>
    );
};

export default TeamPage;
