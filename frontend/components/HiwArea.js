import React from 'react';
import Link from 'next/link';

const HiwArea = () => {
    return (
        <section className="hiw-area">
            <div className="container">
                <div className="row">
                    <div className="col">
                       <Link href="/mission">
                        <div className="hiw-item">
                            <div className="hiw-item-img-box hiw-bg1">
                                <figure>
                                    <img src="/images/hiw-img.jpg" alt="" />
                                        <h3 className="hiw-title">Our Mission</h3>
                                        <div className="hiw-btn-box">
                                            <span className="theme-btn">read more</span>
                                        </div>
                                </figure>
                            </div>
                        </div>
                        </Link>
                    </div>
                    <div className="col">
                        <Link href="/events">
                        <div className="hiw-item">
                            <div className="hiw-item-img-box hiw-bg2">
                                <figure>
                                    <img src="/images/hiw-img2.jpg" alt="" />
                                        <h3 className="hiw-title">Upcoming Events</h3>
                                        <div className="hiw-btn-box">
                                            <span className="theme-btn">read more</span>
                                        </div>
                                </figure>
                            </div>
                        </div>
                        </Link>
                    </div>
                    <div className="col">
                        <Link href="/volunteer">
                        <div className="hiw-item">
                            <div className="hiw-item-img-box hiw-bg3">
                                <figure>
                                    <img src="/images/hiw-img3.jpg" alt="" />
                                        <h3 className="hiw-title">Volunteer Today</h3>
                                        <div className="hiw-btn-box">
                                            <span className="theme-btn">read more</span>
                                        </div>
                                </figure>
                            </div>
                        </div>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HiwArea;
