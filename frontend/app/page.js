import React from 'react';
import NavOne from "../components/NavOne";
import Footer from "../components/Footer";
import SliderOne from "../components/SliderOne";
import EntryArea from "../components/EntryArea";
import HiwArea from "../components/HiwArea";
import ServiceArea from "../components/ServiceArea";
import MixerArea from "../components/MixerArea";
import Causes from "../components/Causes";
import ClientsLogo from "../components/ClientsLogo";
import HelpingArea from "../components/HelpingArea";
import TeamArea from "../components/TeamArea";
import CallToAction from "../components/CallToAction";
import EventsSection from '../components/EventsSection';
import Map from "../components/Map";
import CallToActionTwo from "../components/CallToActionTwo";
import FaqArea from "../components/FaqArea";
import { getEvents } from '../lib/api';

const HomePage = async () => {
    const events = await getEvents();
    return (
        <>
          <NavOne />
          <SliderOne />
          <EntryArea />
          <HiwArea />
          <ServiceArea />
          <MixerArea />
          <EventsSection events={events} />
          <ClientsLogo />
          <HelpingArea />
          <TeamArea />
          <CallToAction />
          <Causes />
          <Map />
          <FaqArea />
          <CallToActionTwo />
          <Footer />
        </>
    );
};

export default HomePage;
