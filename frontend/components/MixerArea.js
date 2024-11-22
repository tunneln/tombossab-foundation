import React, {Component} from 'react';
import CountUp from 'react-countup';
import VisibilitySensor from 'react-visibility-sensor';
import { Swiper, SwiperSlide } from 'swiper/react';
import Link from 'next/link';

import 'swiper/css';
import 'swiper/css/pagination';

import { Pagination, Autoplay } from 'swiper/modules';

class MixerArea extends Component {
    constructor(){
        super()
        this.state = {
            startCounter: false
        }
    }

    onVisibilityChange = isVisible => {
        if (isVisible) {
            this.setState({startCounter: true});
        }
    }

    render() {
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
                                    <Link href="/donate" className="theme-btn">start donation</Link>
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
                                            <VisibilitySensor onChange={this.onVisibilityChange} offset={{top:10}} delayedCall><CountUp end={this.state.startCounter ? 20000 : 0} /></VisibilitySensor>
                                        </h3>
                                        <p className="fun__text">raised by 100 people in 7 days</p>
                                    </div>
                                </div>
                                <div className="fun-content">
                                    <div className="fun-item fun-item2">
                                        <i className="icon-cancer"></i>
                                        <h3 className="counter">
                                            <VisibilitySensor onChange={this.onVisibilityChange} offset={{top:10}} delayedCall><CountUp end={this.state.startCounter ? 20 : 0} /></VisibilitySensor>
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
                                                    No one has ever become poor from giving. 
                                                </h3>
                                                <p className="funslide__name">Anne Frank</p>
                                            </div>
                                        </SwiperSlide>
                                        <SwiperSlide>
                                            <div className="fun-slide-item">
                                                <div className="icon-quote">“</div>
                                                <h3 className="funslide__text">
                                                    Every man must decide whether he will walk in the light
                                                    of creative altruism or in the darkness of destructive selfishness.
                                                </h3>
                                                <p className="funslide__name">Martin Luther King, jr</p>
                                            </div>
                                        </SwiperSlide>
                                        <SwiperSlide>
                                            <div className="fun-slide-item">
                                                <div className="icon-quote">“</div>
                                                <h3 className="funslide__text">
                                                    We make a living by what we get. We make a life by what we give. 
                                                </h3>
                                                <p className="funslide__name">Winston Churchill</p>
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
    }
}

export default MixerArea;