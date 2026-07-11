import React from 'react';
import Link from 'next/link';
import { eventBadge } from './event-format';

// One event card (image, date badge, title, meta list), shared by the upcoming
// (Events) and past (PastEvents) sections. An event without a slug has no
// detail page, so its image/title render unlinked. spacedMeta preserves the
// trailing &nbsp; spacing the original hand-built past-event cards carried.
const EventCard = ({ event, tagClass, spacedMeta = false }) => {
    const { day, monthYear } = eventBadge(event.eventDate);
    return (
        <div className="blog-content">
            <div className="blog-item blog-item1">
                <div className="blog-img">
                    {event.slug ? (
                        <Link href={`/events/${event.slug}`}>
                            <img src={event.image} alt={event.imageAlt} />
                        </Link>
                    ) : (
                        <img src={event.image} alt={event.imageAlt} />
                    )}
                    <span className={`blog__tag ${tagClass}`}>
                        <span className="date__num-text">{day}</span>
                        <span className="date__mon-text">{monthYear}</span>
                    </span>
                </div>
                <div className="blog-inner-content">
                    <h3 className="blog__title">
                        {event.slug ? (
                            <Link href={`/events/${event.slug}`}>{event.title}</Link>
                        ) : (
                            event.title
                        )}
                    </h3>
                    <ul className="blog__list">
                        <li className="blog__dot-active">{event.timeLabel}{spacedMeta && <> &nbsp;&nbsp;</>}</li>
                        <li className="blog__dot-active">{event.venue}{spacedMeta && <> &nbsp;</>}</li>
                        <li className="blog__dot-active">{event.city}</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default EventCard;
