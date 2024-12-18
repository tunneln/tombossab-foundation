import React,{ useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { Pagination, Autoplay } from 'swiper/modules';

const SliderTwo = () => {

    return (
        <section className="slider-area">
            <div className="homepage-slide1">
            <Swiper
                spaceBetween={30}
                centeredSlides={true}
                pagination={{
                    clickable: true,
                }}
                autoplay={{
                    delay: 4500,
                    disableOnInteraction: false,
                }}
                speed={2000}
                loop={true}
                modules={[Autoplay, Pagination]}
                className="frontpageSwiper"
            >
                <SwiperSlide>
                    <div className="single-slide-item slide-bg1">
                        <div className="slide-item-table">
                            <div className="slide-item-tablecell">
                                <div className="container">
                                    <div className="row">
                                        <div className="col-md-7">
                                            <div className="slider-heading">
                                                <p className="slider__meta"></p>
                                                <h2 className="slider__title">We are the Tombossa B Foundation</h2>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="single-slide-item slide-bg2">
                        <div className="slide-item-table">
                            <div className="slide-item-tablecell">
                                <div className="container">
                                    <div className="row">
                                        <div className="col-md-7">
                                            <div className="slider-heading">
                                                <h2 className="slider__desc">The Tombossa B Foundation launches on the 1 year anniversary of Tombossa's passing</h2>
                                                <a href="#" className="theme-btn">Watch Here</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
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
                </SwiperSlide>
            </Swiper>
            </div>
        </section>
    );
};

export default SliderTwo;
