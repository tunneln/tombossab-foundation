import React from 'react';
import Events from './Events';
import PastEvents from './PastEvents';

// Events area shown on the home and events pages: show Upcoming Events when there
// are any, otherwise fall back to Past Events (so the section is never empty).
// The events list comes from the page (API with fixture fallback, see lib/api.js);
// the split is computed at build/revalidate time.
const EventsSection = ({ events = [] }) => {
    // The foundation's events are in Central time, so bucket against the local
    // calendar day. Using the UTC date would flip an event to "Past" hours
    // before local midnight (while it may still be ongoing). en-CA formats as
    // YYYY-MM-DD, matching eventDate.
    const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Chicago' }).format(new Date());
    const upcoming = events.filter((event) => event.eventDate >= today);
    return upcoming.length > 0
        ? <Events events={upcoming} />
        : <PastEvents events={events.filter((event) => event.eventDate < today)} />;
};

export default EventsSection;
