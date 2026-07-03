"use client";

import React from 'react';
import CountUp from 'react-countup';
import { Swiper, SwiperSlide } from 'swiper/react';
import DonateButton from './DonateButton';

import 'swiper/css';
import 'swiper/css/pagination';

import { Pagination, Autoplay } from 'swiper/modules';

const MixerArea = () => {
    return (
        <div>
            <section className="mixer-area">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8">
                            <div className="section-heading mixer-heading">
                                <h2 className="section__title text__white">
                                    <div className="section-icon">
                                        <img src="/images/section-icon.png" alt="section-icon" />
                                    </div>
                                    Fundraising for the people and causes that affect our community
                                </h2>
                                <DonateButton className="theme-btn" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mixer-area2">
                <div className="container">
                    <div className="row fun-content-wrap">
                        <div className="col-sm-6 col-lg-6">
                            <div className="fun-content">
                                <div className="fun-item fun-item1">
                                    <i className="icon-charity"></i>
                                    <h3 className="counter">
                                        {/* enableScrollSpy starts the count when scrolled into
                                            view — replaces react-visibility-sensor (dead on React 19). */}
                                        <CountUp end={11115.25} enableScrollSpy scrollSpyOnce />
                                    </h3>
                                    <p className="fun__text">raised by 75 people in 7 days</p>
                                </div>
                            </div>
                            <div className="fun-content">
                                <div className="fun-item fun-item2">
                                    <i className="icon-cancer"></i>
                                    <h3 className="counter">
                                        <CountUp end={52} enableScrollSpy scrollSpyOnce />
                                    </h3>
                                    <p className="fun__text">volunteers are available to help you</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-6 col-lg-6">
                            <div className="fun-content-slide">

                                <Swiper
                                    style={{
                                        '--swiper-pagination-color': 'pink'
                                    }}
                                    pagination={{
                                        dynamicBullets: true,
                                    }}
                                    loop={true}
                                    speed={3500}
                                    spaceBetween={15}
                                    autoplay={{
                                        delay: 2500,
                                        disableOnInteraction: true
                                    }}
                                    modules={[Pagination, Autoplay]}
                                    className="mixerAreaSwiper"
                                >
                                    <SwiperSlide>
                                        <div className="fun-slide-item">
                                            <div className="icon-quote">“</div>
                                            <h3 className="funslide__text">
                                                We make a living by what we get, but we make a life by what we give.
                                            </h3>
                                            <p className="funslide__name">Maya Angelou</p>
                                        </div>
                                    </SwiperSlide>
                                    <SwiperSlide>
                                        <div className="fun-slide-item">
                                            <div className="icon-quote">“</div>
                                            <h3 className="funslide__text">
                                                Every man must decide whether he will walk in the light
                                                of creative altruism or in the darkness of destructive selfishness.
                                            </h3>
                                            <p className="funslide__name">Martin Luther King, Jr.</p>
                                        </div>
                                    </SwiperSlide>
                                    <SwiperSlide>
                                        <div className="fun-slide-item">
                                            <div className="icon-quote">“</div>
                                            <h3 className="funslide__text">
                                                The best way to find yourself is to lose yourself in the service of others.
                                            </h3>
                                            <p className="funslide__name">Mahatma Gandhi</p>
                                        </div>
                                    </SwiperSlide>
                                    <SwiperSlide>
                                        <div className="fun-slide-item">
                                            <div className="icon-quote">“</div>
                                            <h3 className="funslide__text">
                                                We are each other's harvest; we are each other's business; we are each other's magnitude and bond.
                                            </h3>
                                            <p className="funslide__name">Gwendolyn Brooks</p>
                                        </div>
                                    </SwiperSlide>
                                </Swiper>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default MixerArea;
