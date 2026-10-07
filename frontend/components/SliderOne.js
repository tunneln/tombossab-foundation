"use client";

import React,{ useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import Link from 'next/link';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { Pagination, Autoplay } from 'swiper/modules';

import { useGala } from './gala/GalaState';
import { gala } from '../config/gala-2026';

// Gala slide copy per gala state (config/gala-2026.js holds the text).
const GALA_SLIDE = {
    coming_soon: { subline: gala.homeSlide.subline, primary: 'Learn More', sponsor: true, kicker: true },
    on_sale: { subline: gala.homeSlide.subline, primary: 'Learn More', sponsor: true, kicker: true },
    online_closed: { subline: gala.homeSlide.closedSubline, primary: 'Event Details', sponsor: false, kicker: false },
    past: { subline: gala.homeSlide.pastSubline, primary: 'See the Recap', sponsor: false, kicker: false },
};

// Autoplay glides slowly; slides the visitor moves (swipe, drag, or a dot) move
// quickly, or a swipe would take 3.5s to settle. The speed is raised when the
// visitor starts moving a slide and reset once that animated transition ends.
// (Loop mode also runs instant, zero-length transitions when a drag starts;
// those must not reset it, or the release would glide at the slow speed.)
const AUTOPLAY_SPEED = 3500;
const USER_SPEED = 600;
const userMoving = (swiper) => { swiper.params.speed = USER_SPEED; };
// A gesture can also end with no transition at all (a drag back to exactly
// where it started, a tap on the current dot): then restore the slow speed
// right away, once Swiper has had its turn to start one.
const settle = (swiper) => setTimeout(() => {
    if (!swiper.destroyed && !swiper.animating) swiper.params.speed = AUTOPLAY_SPEED;
}, 0);

const SliderOne = () => {
    // The gala slide leads the slider until homeSlide.removeAfter. Whether it
    // shows comes with the gala state (decided at render time, re-checked by the
    // browser), so the static homepage already has the right slides and the
    // slider doesn't re-render every minute. The Swiper is keyed on it so the
    // looped slider remounts cleanly if it ever flips while the page is open.
    const { state, slideVisible: showGala } = useGala();
    const galaSlide = GALA_SLIDE[state];
    const animated = useRef(false);

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
                    delay: 7000,
                    // Keep cycling after a swipe (the timer restarts) instead of stopping for good.
                    disableOnInteraction: false,
                }}
                speed={AUTOPLAY_SPEED}
                grabCursor={true}
                onSliderFirstMove={userMoving}
                onTouchEnd={settle}
                onSetTransition={(swiper, duration) => { if (duration > 0) animated.current = true; }}
                onTransitionEnd={(swiper) => {
                    if (!animated.current) return;
                    animated.current = false;
                    swiper.params.speed = AUTOPLAY_SPEED;
                }}
                onAfterInit={(swiper) => {
                    swiper.pagination.el?.addEventListener('pointerdown', () => userMoving(swiper));
                    swiper.pagination.el?.addEventListener('click', () => settle(swiper));
                }}
                loop={true}
                modules={[Autoplay, Pagination]}
                className="frontpageSwiper"
            >
                {showGala && (
                    <SwiperSlide>
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
                <SwiperSlide>
                    <div className="single-slide-item slide-bg3">
                        <div className="slide-item-table">
                            <div className="slide-item-tablecell">
                                <div className="container">
                                    <div className="row">
                                        <div className="slider-heading">
                                            <h3 className="slider__desc">
                                                <div className="slider__box">Meet our 2026 scholarship recipients! Learn how they're making a difference in their communities.</div>
                                            </h3>
                                        </div>
                                        <Link href="/award-recipients" className="theme-btn slider-btn">Meet Our Scholars</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
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
                <SwiperSlide>
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
            </Swiper>

            </div>
        </section>
    );
};

export default SliderOne;
