import React from 'react';
import Layout from "../components/Layout";
import NavTwo from "../components/NavTwo";
import Footer from "../components/Footer";
import SliderTwo from "../components/SliderTwo";
import GiveArea from "../components/GiveArea";
import MakeWorldArea from "../components/MakeWorldArea";
import ClientsLogo from "../components/ClientsLogo";
import DonateArea from "../components/DonateArea";
import MixerAreaThree from "../components/MixerAreaThree";
import Causes from "../components/Causes";
import CategoryArea from "../components/CategoryArea";
import GalleryCarousel from "../components/GalleryCarousel";
import Pricing from "../components/Pricing";
import Events from "../components/Events";
import VolunteerArea from "../components/VolunteerArea";
import CallToActionThree from "../components/CallToActionThree";

const HomePageTwo = () => {
    return (
        <Layout pageTitle="Tombossa B Foundation | Home 2">
            <NavTwo />
            <SliderTwo />
            <GiveArea />
            <MakeWorldArea />
            <ClientsLogo />
            <DonateArea />
            <MixerAreaThree />
            <Causes />
            <CategoryArea />
            <GalleryCarousel />
            <Pricing />
            <Events />
            <VolunteerArea />
            <CallToActionThree />
            <Footer />
        </Layout>
    );
};

export default HomePageTwo;
