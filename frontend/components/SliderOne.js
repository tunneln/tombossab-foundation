import React,{ useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import Link from 'next/link';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { Pagination, Autoplay } from 'swiper/modules';

const SliderOne = () => {

    return (
        <section className="slider-area">
            <div className="homepage-slide1">
            <Swiper
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
                    delay: 7000
                }}
                speed={3500}
                loop={true}
                modules={[Autoplay, Pagination]}
                className="frontpageSwiper"
            >
                <SwiperSlide className='swiper-no-swiping'>
                    <div className="single-slide-item slide-bg1">
                        <div className="slide-item-table">
                            <div className="slide-item-tablecell">
                                <div className="container">
                                    <div className="row">
                                        <div className="slider-heading">
                                            <h3 className="slider__desc">
                                                <div className="slider__box">Empowering Eritrean and East African communities through education, support, and opportunity.</div>
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
                    <div className="single-slide-item" style={{
                        background: 'url("/images/coffee-women-empowerment.jpg") no-repeat center center',
                        backgroundSize: 'cover'
                    }}>
                        <div className="slide-item-table">
                            <div className="slide-item-tablecell">
                                <div className="container">
                                    <div className="row">
                                        <div className="slider-heading">
                                            <h3 className="slider__desc">
                                                <div className="slider__box">Coffee &amp; Women Empowerment—Join Us June 27, 2–6PM for Coffee, Conversation &amp; Encouragement with guest speaker Dr. Yacob Tekie!</div>
                                            </h3>
                                        </div>
                                        <Link href="/coffee-women-empowerment" className="theme-btn slider-btn">Read More</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>
                <SwiperSlide className='swiper-no-swiping'>
                    <div className="single-slide-item slide-bg2">
                        <div className="slide-item-table">
                            <div className="slide-item-tablecell">
                                <div className="container">
                                    <div className="row">
                                        <div className="slider-heading">
                                            <h3 className="slider__desc">
                                                <div className="slider__box">Meet our scholarship award recipients — students making a difference in their communities.</div>
                                            </h3>
                                        </div>
                                        <Link href="/award-recipients" className="theme-btn slider-btn">Meet Our Scholars</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>
                <SwiperSlide className='swiper-no-swiping'>
                    <div className="single-slide-item" style={{
                        background: 'url("/newsletters/june-2026-cover.jpg") no-repeat center center',
                        backgroundSize: 'cover'
                    }}>
                        <div className="slide-item-table">
                            <div className="slide-item-tablecell">
                                <div className="container">
                                    <div className="row">
                                        <div className="slider-heading">
                                            <h3 className="slider__desc">
                                                <div className="slider__box">Read our June Newsletter — featuring guest speaker Dr. Yacob Tekie and mental health resources for our community.</div>
                                            </h3>
                                        </div>
                                        <a href="/newsletters/june-2026-newsletter.pdf" target="_blank" rel="noopener noreferrer" className="theme-btn slider-btn">Read Here!</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>
                {/* <SwiperSlide>
                    <div className="single-slide-item slide-bg3">
                        <div className="slide-item-table">
                            <div className="slide-item-tablecell">
                                <div className="container">
                                    <div className="row">
                                        <div className="col-md-7">
                                            <div className="slider-heading">
                                                <p className="slider__meta">welcome to the Tombossa B Foundation</p>
                                                <h2 className="slider__title">Lend the helping hand get involved</h2>
                                                <a href="#" className="theme-btn">discover more</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </SwiperSlide> */}
            </Swiper>
            </div>
        </section>
    );
};

export default SliderOne;
