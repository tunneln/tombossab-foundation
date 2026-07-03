import React from 'react';
import Link from 'next/link';
import { eventBadge } from './event-format';

// Upcoming events, received from the page as a prop (see EventsSection).
const Events = ({ events = [] }) => {
    if (events.length === 0) return null;

    return (
        <section className="causes-area upcoming-event-area upcoming-event-area2">
            <div className="container">

                <div className="row">
                    <div className="col-lg-8 mx-auto">
                        <div className="section-heading blog-heading text-center">
                            <div className="section-icon">
                                <img src="/images/section-icon.png" alt="section-icon" />
                            </div>
                            <h2 className="section__title">Upcoming Events</h2>
                            <p className="section__meta">join us</p>
                            <br />
                        </div>
                    </div>
                </div>

                <div className="row blog-content-wrap">
                    {events.map((event) => {
                        const { day, monthYear } = eventBadge(event.eventDate);
                        return (
                            <div className="col-lg-4" key={event.slug ?? event.title}>
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
                                            <span className="blog__tag blog__tag1">
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
                                                <li className="blog__dot-active">{event.timeLabel}</li>
                                                <li className="blog__dot-active">{event.venue}</li>
                                                <li className="blog__dot-active">{event.city}</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Events;
