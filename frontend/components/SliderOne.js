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
                    '--swiper-pagination-bullet-size': '18px',
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
                    <div className="single-slide-item slide-bg2">
                        <div className="slide-item-table">
                            <div className="slide-item-tablecell">
                                <div className="container">
                                    <div className="row">
                                        <div className="slider-heading">
                                            <h3 className="slider__desc">
                                                <div className="slider__box">The Tombossa B Foundation launches on the memorial of Tombossa's passing.</div>
                                            </h3>
                                        </div>
                                        <Link href="/gallery" className="theme-btn slider-btn">Photos</Link>
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
