import React from 'react';
import EventCard from './EventCard';

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
                    {events.map((event) => (
                        <div className="col-lg-4" key={event.slug ?? event.title}>
                            <EventCard event={event} tagClass="blog__tag1" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Events;
