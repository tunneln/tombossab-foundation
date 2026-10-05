"use client";

import React,{ useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import Link from 'next/link';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { Pagination, Autoplay } from 'swiper/modules';

import { useGala, useGalaNow } from './gala/GalaState';
import { gala } from '../config/gala-2026';
import { isAfter } from '../lib/gala';

// Gala slide copy per gala state (config/gala-2026.js holds the text).
const GALA_SLIDE = {
    coming_soon: { subline: gala.homeSlide.subline, primary: 'Learn More', sponsor: true, kicker: true },
    on_sale: { subline: gala.homeSlide.subline, primary: 'Get Tickets', sponsor: true, kicker: true },
    online_closed: { subline: gala.homeSlide.closedSubline, primary: 'Event Details', sponsor: false, kicker: false },
    past: { subline: gala.homeSlide.pastSubline, primary: 'See the Recap', sponsor: false, kicker: false },
};

const SliderOne = () => {
    // The gala slide leads the slider until homeSlide.removeAfter, then removes
    // itself (client-side, once the date is known). The Swiper is keyed on it so
    // the looped slider remounts cleanly instead of splicing a slide out.
    const { state } = useGala();
    const now = useGalaNow();
    const showGala = !(now && isAfter(gala.homeSlide.removeAfter, now));
    const galaSlide = GALA_SLIDE[state];

    return (
        <section className="slider-area">
            <div className="homepage-slide1">
            <Swiper
                key={showGala ? 'with-gala' : 'without-gala'}
                style={{
                    '--swiper-pagination-color': '#f1ae44',
                    '--swiper-pagination-bullet-size': '16px',
                    '--swiper-pagination-top': '0px',
                    '--swiper-pagination-bottom': '0px'

                }}
                spaceBetween={5}
                centeredSlides={true}
                pagination={{
                    clickable: true,
                }}
                autoplay={{
                    delay: 9000
                }}
                speed={3500}
                loop={true}
                modules={[Autoplay, Pagination]}
                className="frontpageSwiper"
            >
                {showGala && (
                    <SwiperSlide className='swiper-no-swiping'>
                        <div className="single-slide-item slide-bg-gala">
                            <div className="slide-item-table">
                                <div className="slide-item-tablecell">
                                    <div className="container">
                                        <div className="gala-slide">
                                            {galaSlide.kicker && <p className="gala-slide__eyebrow">{gala.copy.kicker}</p>}
                                            <h2 className="gala-slide__title"><span className="gala-slide__lead">{gala.copy.titleLead} </span>{gala.shortName}</h2>
                                            <p className="gala-slide__date">
                                                {gala.homeSlide.dateLine.split(' · ').map((part, i) => (
                                                    <React.Fragment key={part}>
                                                        {i > 0 && <span className="gala-slide__sep"> · </span>}
                                                        <span className="gala-slide__part">{part}</span>
                                                    </React.Fragment>
                                                ))}
                                            </p>
                                            <p className="gala-slide__subline">{galaSlide.subline}</p>
                                            <div className="gala-slide__ctas">
                                                <Link href="/gala" className="gala-slide__btn gala-slide__btn--primary">{galaSlide.primary}</Link>
                                                {galaSlide.sponsor && (
                                                    <Link href="/gala#sponsor" className="gala-slide__btn gala-slide__btn--outline">Become a Sponsor</Link>
                                                )}
                                            </div>
                                            <span className="gala-slide__motif" aria-hidden="true"></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                )}
                <SwiperSlide className='swiper-no-swiping'>
                    <div className="single-slide-item slide-bg1">
                        <div className="slide-item-table">
                            <div className="slide-item-tablecell">
                                <div className="container">
                                    <div className="row">
                                        <div className="slider-heading">
                                            <h3 className="slider__desc">
                                                <div className="slider__box">Empowering Eritrean and East African communities through education, wellness, and opportunity.</div>
                                            </h3>
                                        </div>
                                        <Link href="/about" className="theme-btn slider-btn">
                                            About Us
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>
                <SwiperSlide className='swiper-no-swiping'>
                    <div className="single-slide-item slide-bg4">
                        <div className="slide-item-table">
                            <div className="slide-item-tablecell">
                                <div className="container">
                                    <div className="row">
                                        <div className="slider-heading">
                                            <h3 className="slider__desc">
                                                <div className="slider__box">Read our September Newsletter — highlights from the Eritrean Festival and a save-the-date for our 2026 Gala!</div>
                                            </h3>
                                        </div>
                                        <a href="/newsletters/september-2026-newsletter.pdf" target="_blank" rel="noopener noreferrer" className="theme-btn slider-btn">Read Here!</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>
                <SwiperSlide className='swiper-no-swiping'>
                    <div className="single-slide-item slide-bg3">
                        <div className="slide-item-table">
                            <div className="slide-item-tablecell">
                                <div className="container">
                                    <div className="row">
                                        <div className="slider-heading">
                                            <h3 className="slider__desc">
                                                <div className="slider__box">Meet our scholarship award recipients! Learn how they're making a difference in their communities.</div>
                                            </h3>
                                        </div>
                                        <Link href="/award-recipients" className="theme-btn slider-btn">Meet Our Scholars</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>
            </Swiper>

            </div>
        </section>
    );
};

export default SliderOne;
