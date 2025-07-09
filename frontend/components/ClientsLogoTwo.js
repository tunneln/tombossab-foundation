import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/free-mode';

import { FreeMode, Autoplay } from 'swiper/modules';

const ClientsLogoTwo = () => {

    return (
        <section className="clientlogo-area">
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="client-logo">
                            <Swiper
                                slidesPerView={5}
                                loop={true}
                                spaceBetween={30}
                                speed={5000}
                                freeMode={true}
                                autoplay={{
                                    delay: 200,
                                    disableOnInteraction: false
                                }}
                                modules={[FreeMode, Autoplay]}
                                breakpoints={{
                                    1499:{
                                        slidesPerView: 5
                                    },
                                    991:{
                                        slidesPerView: 3
                                    },
                                    767:{
                                        slidesPerView: 3

                                    },
                                    575:{
                                        slidesPerView: 2
                                    }
                                }}
                                className="logoSwiper"
                            >
                                <SwiperSlide>
                                    <div className="client-logo-item">
                                        <img src="/images/logo-client.png" alt="brand image" />
                                    </div>
                                </SwiperSlide>
                                <SwiperSlide>
                                    <div className="client-logo-item">
                                        <img src="/images/logo-client.png" alt="brand image" />
                                    </div>
                                </SwiperSlide>
                                <SwiperSlide>
                                    <div className="client-logo-item">
                                        <img src="/images/logo-client.png" alt="brand image" />
                                    </div>
                                </SwiperSlide>
                                <SwiperSlide>
                                    <div className="client-logo-item">
                                        <img src="/images/logo-client.png" alt="brand image" />
                                    </div>
                                </SwiperSlide>
                                <SwiperSlide>
                                    <div className="client-logo-item">
                                        <img src="/images/logo-client.png" alt="brand image" />
                                    </div>
                                </SwiperSlide>
                                <SwiperSlide>
                                    <div className="client-logo-item">
                                        <img src="/images/logo-client.png" alt="brand image" />
                                    </div>
                                </SwiperSlide>
                            </Swiper>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ClientsLogoTwo;
