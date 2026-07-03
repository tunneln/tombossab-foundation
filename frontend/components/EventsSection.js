import React from 'react';
import Events from './Events';
import PastEvents from './PastEvents';

// Events area shown on the home and events pages: show Upcoming Events when there
// are any, otherwise fall back to Past Events (so the section is never empty).
// The events list comes from the page (API with fixture fallback, see lib/api.js);
// the split is computed at build/revalidate time.
const EventsSection = ({ events = [] }) => {
    const today = new Date().toISOString().slice(0, 10);
    const upcoming = events.filter((event) => event.eventDate >= today);
    return upcoming.length > 0
        ? <Events events={upcoming} />
        : <PastEvents events={events.filter((event) => event.eventDate < today)} />;
};

export default EventsSection;
