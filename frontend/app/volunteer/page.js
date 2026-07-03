import React from 'react';
import NavOne from "../../components/NavOne";
import PageHeader from "../../components/PageHeader";
import Footer from "../../components/Footer";
import Volunteer from "../../components/Volunteer";

export const metadata = { title: "Tombossa B Foundation | Volunteer" };

const VolunteerPage = () => {
    return (
        <>
            <NavOne />
            <PageHeader title="become a volunteer" />
            <Volunteer />
            <Footer />
        </>
    );
};

export default VolunteerPage;
