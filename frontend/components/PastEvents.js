import React from 'react';
import Link from 'next/link';

const PastEvents = () => {

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
                    <div className="col-lg-4">
                        <div className="blog-content">
                            <div className="blog-item blog-item1">
                                <div className="blog-img">
                                    <Link href="/events/coffee-women-empowerment-1">
                                        <img src="/images/coffee-women-empowerment.jpg" alt="Coffee & Women Empowerment" />
                                    </Link>
                                    <span className="blog__tag blog__tag3">
                                        <span className="date__num-text">27</span>
                                        <span className="date__mon-text">Jun 2026</span>
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
                    <div className="col-lg-4">
                        <div className="blog-content">
                            <div className="blog-item blog-item1">
                                <div className="blog-img">
                                    <Link href="/events/community-field-day-2025">
                                        <img src="/images/img8.jpg" alt="Community Field Day" />
                                    </Link>
                            <span className="blog__tag blog__tag1">
                                <span className="date__num-text">26</span>
                                <span className="date__mon-text">Jul 2025</span>
                            </span>
                                </div>
                                <div className="blog-inner-content">
                                    <h3 className="blog__title">
                                        <Link href="/events/community-field-day-2025">Community Field Day</Link>
                                    </h3>
                                    <ul className="blog__list">
                                        <li className="blog__dot-active">3:30pm to 9:00pm &nbsp;&nbsp;</li>
                                        <li className="blog__dot-active">Cottonwood Park &nbsp;</li>
                                        <li className="blog__dot-active">Richardson, TX</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="blog-content">
                            <div className="blog-item blog-item1">
                                <div className="blog-img">
                                    <img src="/images/img7.jpg" alt="" />
                            <span className="blog__tag blog__tag2">
                                <span className="date__num-text">30</span>
                                <span className="date__mon-text">Nov 2024</span>
                            </span>
                                </div>
                                <div className="blog-inner-content">
                                    <h3 className="blog__title">Memorial of Tombossa Negusse | Foundation Inauguration</h3>
                                    <ul className="blog__list">
                                        <li className="blog__dot-active">11:00am to 2:00pm &nbsp;&nbsp;</li>
                                        <li className="blog__dot-active">High Point Center &nbsp;</li>
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

export default PastEvents;
