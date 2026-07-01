import React from 'react';
import Link from 'next/link';

// Upcoming events. Empty right now — the most recent one (Coffee & Women
// Empowerment) has passed and now lives in PastEvents. Add an entry here to bring
// the Upcoming Events section back; <EventsSection> renders this only when there
// is at least one upcoming event, otherwise it falls back to Past Events.
//
// Shape (mirrors the card markup below):
//   {
//     href: '/events/<slug>',
//     image: '/images/<file>', imageAlt: 'Alt text',
//     day: '27', month: 'Jun',
//     title: 'Event Name',
//     meta: ['2:00pm to 6:00pm', '7522 Overdale Dr.', 'Dallas, TX'],
//   }
export const UPCOMING_EVENTS = [];

const Events = () => {
    if (UPCOMING_EVENTS.length === 0) return null;

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
                    {UPCOMING_EVENTS.map((event) => (
                        <div className="col-lg-4" key={event.href}>
                            <div className="blog-content">
                                <div className="blog-item blog-item1">
                                    <div className="blog-img">
                                        <Link href={event.href}>
                                            <img src={event.image} alt={event.imageAlt} />
                                        </Link>
                                        <span className="blog__tag blog__tag1">
                                            <span className="date__num-text">{event.day}</span>
                                            <span className="date__mon-text">{event.month}</span>
                                        </span>
                                    </div>
                                    <div className="blog-inner-content">
                                        <h3 className="blog__title">
                                            <Link href={event.href}>{event.title}</Link>
                                        </h3>
                                        <ul className="blog__list">
                                            {event.meta.map((line, i) => (
                                                <li className="blog__dot-active" key={i}>{line}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Events;
