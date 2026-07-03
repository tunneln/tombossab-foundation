import React from 'react';
import NavOne from "../../components/NavOne";
import PageHeader from "../../components/PageHeader";
import Footer from "../../components/Footer";
import Contact from "../../components/Contact";
import Map from "../../components/Map";

export const metadata = { title: "Tombossa B Foundation | Contact" };

const ContactPage = () => {
    return (
        <>
            <NavOne />
            <PageHeader title="Contact" />
            <Contact />
            <Map />
            <Footer />
        </>
    );
};

export default ContactPage;
