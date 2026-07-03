import React from 'react';
import NavOne from "../../components/NavOne";
import PageHeader from "../../components/PageHeader";
import AboutArea from "../../components/AboutArea";
import MixerAreaTwo from "../../components/MixerAreaTwo";
import TeamArea from "../../components/TeamArea";
import FaqArea from "../../components/FaqArea";
import ServiceArea from "../../components/ServiceArea";
import ClientsLogoTwo from "../../components/ClientsLogoTwo";
import Footer from "../../components/Footer";

export const metadata = { title: "Tombossa B Foundation | About Us" };

const AboutPage = () => {
    return (
        <>
            <NavOne />
            <PageHeader title="About Us" />
            <AboutArea />
            <MixerAreaTwo />
            <TeamArea />
            <FaqArea />
            <ServiceArea />
            <ClientsLogoTwo />
            <Footer />
        </>
    );
};

export default AboutPage;
