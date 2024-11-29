import React from 'react';
import Link from 'next/link';

const ServiceArea = () => {
    return (
        <section className="service-area text-center">
            <img src="/images/heart-icon1.png" alt="" className="heart-icon heart-icon-1" />
            <img src="/images/heart-icon2.png" alt="" className="heart-icon heart-icon-2" />
            <img src="/images/heart-icon3.png" alt="" className="heart-icon heart-icon-3" />
            <img src="/images/heart-icon4.png" alt="" className="heart-icon heart-icon-4" />
            <img src="/images/heart-icon5.png" alt="" className="heart-icon heart-icon-5" />
            <img src="/images/heart-icon6.png" alt="" className="heart-icon heart-icon-6" />
            <img src="/images/heart-icon7.png" alt="" className="heart-icon heart-icon-7" />
            <img src="/images/heart-icon8.png" alt="" className="heart-icon heart-icon-8" />
            <img src="/images/heart-icon9.png" alt="" className="heart-icon heart-icon-9" />
            <img src="/images/heart-icon10.png" alt="" className="heart-icon heart-icon-10" />
            <img src="/images/heart-icon11.png" alt="" className="heart-icon heart-icon-11" />
            <div className="container">
                <div className="row">
                    <div className="col-lg-8 mx-auto">
                        <div className="section-heading service-heading">
                            <div className="section-icon">
                                <img src="/images/section-icon.png" alt="section-icon" />
                            </div>
                            <h2 className="section__title">We Believe That
                                We Can Save More Lives With You</h2>
                            <p className="section__meta">help us now</p>
                        </div>
                    </div>
                </div>
                <div className="row service-wrap">
                    <div className="col">
                        <div className="service-item service-item1">
                            <div className="service-item-inner">
                                <div className="service-icon">
                                    <i className="icon-peace-1"></i>
                                </div>
                                <div className="service-content">
                                    <h4 className="service__title">hope</h4>
                                    <p className="service__desc">
                                    Building a brighter future through hope, compassion, and collective action.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="service-item service-item2">
                            <div className="service-item-inner">
                                <div className="service-icon">
                                    <i className="icon-praying"></i>
                                </div>
                                <div className="service-content">
                                    <h4 className="service__title">prayer</h4>
                                    <p className="service__desc">
                                    Guided by faith, we trust in God's plan for hope and a brighter future. (Jeremiah 29:11)
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="service-item service-item3">
                            <div className="service-item-inner">
                                <div className="service-icon">
                                    <i className="icon-peace"></i>
                                </div>
                                <div className="service-content">
                                    <h4 className="service__title">peace</h4>
                                    <p className="service__desc">
                                    Together for peace, empowering lives and transforming futures. 
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="service-item service-item4">
                            <div className="service-item-inner">
                                <div className="service-icon">
                                    <i className="icon-heart"></i>
                                </div>
                                <div className="service-content">
                                    <h4 className="service__title">donation</h4>
                                    <p className="service__desc">
                                    Donation is a powerful act that spreads hope, uplifts lives, and reflects the compassion that connects us all. 
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-12">
                        <div className="button-shared">
                            <Link href="https://donorbox.org/scholarship-fund-73?default_interval=o" className="theme-btn custom-dbox-popup" data-reminder-widget-enabled="true">
                                <img src="https://donorbox.org/images/white_logo.svg"/> &nbsp;Donate
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ServiceArea;
