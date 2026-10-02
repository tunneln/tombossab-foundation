import React from 'react';
import Link from 'next/link';
import { eventBadge } from './event-format';

// One event card (image, date badge, title, meta list), shared by the upcoming
// (Events) and past (PastEvents) sections. An event without a slug has no
// detail page, so its image/title render unlinked. spacedMeta preserves the
// trailing &nbsp; spacing the original hand-built past-event cards carried.
// Optional event fields (used by the gala card, see GalaEvents): `href` links
// somewhere other than /events/<slug>, `tagClass` overrides the badge color,
// `cardClass` adds a class to the card, `pill` shows a small label on the image.
const EventCard = ({ event, tagClass, spacedMeta = false }) => {
    const { day, monthYear } = eventBadge(event.eventDate);
    const href = event.href ?? (event.slug ? `/events/${event.slug}` : null);
    return (
        <div className="blog-content">
            <div className={`blog-item blog-item1 ${event.cardClass ?? ''}`.trim()}>
                <div className="blog-img">
                    {href ? (
                        <Link href={href}>
                            <img src={event.image} alt={event.imageAlt} />
                        </Link>
                    ) : (
                        <img src={event.image} alt={event.imageAlt} />
                    )}
                    {event.pill && <span className="event-card__pill">{event.pill}</span>}
                    <span className={`blog__tag ${event.tagClass ?? tagClass}`}>
                        <span className="date__num-text">{day}</span>
                        <span className="date__mon-text">{monthYear}</span>
                    </span>
                </div>
                <div className="blog-inner-content">
                    <h3 className="blog__title">
                        {href ? (
                            <Link href={href}>{event.title}</Link>
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
