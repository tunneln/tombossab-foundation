import React from 'react';
import Events, { UPCOMING_EVENTS } from './Events';
import PastEvents from './PastEvents';

// Events area shown on the home and events pages: show Upcoming Events when there
// are any, otherwise fall back to Past Events (so the section is never empty).
const EventsSection = () => (UPCOMING_EVENTS.length > 0 ? <Events /> : <PastEvents />);

export default EventsSection;
