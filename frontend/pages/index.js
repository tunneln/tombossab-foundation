import React from 'react';
import Layout from "../components/Layout";
import NavOne from "../components/NavOne";
import Footer from "../components/Footer";
import SliderOne from "../components/SliderOne";
import EntryArea from "../components/EntryArea";
import HiwArea from "../components/HiwArea";
import ServiceArea from "../components/ServiceArea";
import MixerArea from "../components/MixerArea";
import LatestCauses from "../components/LatestCauses";
import ClientsLogo from "../components/ClientsLogo";
import HelpingArea from "../components/HelpingArea";
import TeamArea from "../components/TeamArea";
import CallToAction from "../components/CallToAction";
import EventsHome from '../components/EventsHome';
import Map from "../components/Map";
import CallToActionTwo from "../components/CallToActionTwo";

const HomePage = () => {
    return (
        <Layout pageTitle="Tombossa B Foundation">
          <NavOne />
          <SliderOne />
          <EntryArea />
          <HiwArea />
          <ServiceArea />
          <MixerArea />
          <LatestCauses />
          <ClientsLogo />
          <HelpingArea />
          <TeamArea />
          <CallToAction />
          <EventsHome />
          <Map />
          <CallToActionTwo />
          <Footer />
        </Layout>
    );
};

export default HomePage;
