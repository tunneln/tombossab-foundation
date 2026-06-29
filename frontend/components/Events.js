import React from 'react';
import Link from 'next/link';

const Events = () => {

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
                    <div className="col-lg-4">
                        <div className="blog-content">
                            <div className="blog-item blog-item1">
                                <div className="blog-img">
                                    <Link href="/events/coffee-women-empowerment-1">
                                        <img src="/images/coffee-women-empowerment-poster.jpg" alt="Coffee & Women Empowerment Poster" />
                                    </Link>
                                    <span className="blog__tag blog__tag1">
                                        <span className="date__num-text">27</span>
                                        <span className="date__mon-text">jun</span>
                                    </span>
                                </div>
                                <div className="blog-inner-content">
                                    <h3 className="blog__title">
                                        <Link href="/events/coffee-women-empowerment-1">Coffee &amp; Women Empowerment</Link>
                                    </h3>
                                    <ul className="blog__list">
                                        <li className="blog__dot-active">2:00pm to 6:00pm &nbsp;&nbsp;</li>
                                        <li className="blog__dot-active">7522 Overdale Dr. &nbsp;</li>
                                        <li className="blog__dot-active">Dallas, TX</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Events;
