"use client";

import React from 'react';
import Events from './Events';
import PastEvents from './PastEvents';
import useGalaState from './gala/useGalaState';
import { gala } from '../config/gala-2026';
import { cardTimeLabel, venueCity } from '../lib/gala';

// /events with the gala featured. The gala card comes from config (it is not in
// the events database) and links to /gala. It sits in Upcoming Events until the
// night is over, then moves to the top of Past Events. Pages are static, so
// that move happens client-side once the date is known (useGalaState).
const GalaEvents = ({ upcoming = [], past = [] }) => {
    const { state } = useGalaState();
    const isPast = state === 'past';
    const card = {
        slug: null,
        href: '/gala',
        title: `Tombossa B Foundation Gala ${gala.year}`,
        eventDate: gala.eventDate,
        timeLabel: cardTimeLabel(),
        venue: gala.venue.name ?? 'Venue TBA',
        city: venueCity() ?? '',
        image: '/images/gala-2026-card.jpg',
        imageAlt: `The Tombossa B Foundation Gala, ${gala.dateDisplay}`,
        tagClass: 'blog__tag-gala',
        cardClass: 'event-card--gala',
        pill: state === 'on_sale' ? 'Tickets on sale' : null,
    };

    return (
        <>
            <Events events={isPast ? upcoming : [card, ...upcoming]} />
            <PastEvents events={isPast ? [card, ...past] : past} />
        </>
    );
};

export default GalaEvents;
