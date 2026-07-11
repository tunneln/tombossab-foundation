import React from 'react';
import EventCard from './EventCard';

// The date badge cycles through the theme's accent colors, newest card first:
// gold (tag3), teal (tag1), red (tag2) — matching the original hand-built cards.
const TAG_VARIANTS = ['blog__tag3', 'blog__tag1', 'blog__tag2'];

// Past events, received from the page as a prop (see EventsSection).
const PastEvents = ({ events = [] }) => {

    return (
        <section className="causes-area past-causes-area upcoming-event-area upcoming-event-area2">
            <div className="container">

                <div className="row">
                    <div className="col-lg-8 mx-auto">
                        <div className="section-heading blog-heading text-center">
                            <div className="section-icon">
                                <img src="/images/section-icon.png" alt="section-icon" />
                            </div>
                            <h2 className="section__title">Past Events</h2>
                            <p className="section__meta"><br/></p>
                        </div>
                    </div>
                </div>

                <div className="row blog-content-wrap">
                    {events.map((event, index) => (
                        <div className="col-lg-4" key={event.slug ?? event.title}>
                            <EventCard
                                event={event}
                                tagClass={TAG_VARIANTS[index % TAG_VARIANTS.length]}
                                spacedMeta
                            />
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default PastEvents;
