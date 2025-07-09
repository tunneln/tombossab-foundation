import React from 'react';
import Link from 'next/link';

const Causes = () => {

    return (
        <div>
            <section className="causes-area">
                <div className="container">

                    <div className="row">
                        <div className="col-lg-8 mx-auto">
                            <div className="section-heading blog-heading text-center">
                                <div className="section-icon">
                                    <img src="/images/section-icon.png" alt="section-icon" />
                                </div>
                                <h2 className="section__title">Latest Causes</h2>
                                <p className="section__meta">join us</p>
                            </div>
                        </div>
                    </div>

                    <div className="row blog-content-wrap">
                        <div className="col-lg-4">
                            <div className="blog-content">
                                <div className="blog-item blog-item1">
                                    <div className="blog-img">
                                        <img src="/images/img1.jpg" alt="" />
                                            <span className="blog__tag"><i className="fa fa-flash"></i> Most Recent</span>
                                    </div>
                                    <div className="blog-inner-content">
                                        <h3 className="blog__title"><Link href="#">Future Scholar Fund</Link>
                                        </h3>
                                        <p className="blog__desc"> Empowering Eritrean and East African youth via scholarships and prep resources to unlock education and potential. </p>
                                        <ul className="blog__list">
                                            <li><i className="icon-target"></i> Goal: <span>$50,000</span></li>
                                        </ul>
                                        <Link href="/donatenow" className="theme-btn">
                                            Donate Now
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="blog-content">
                                <div className="blog-item blog-item2">
                                    <div className="blog-img">
                                        <img src="/images/img2.jpg" alt="" />
                                            <span className="blog__tag"><i className="fa fa-flash"></i> Most Recent</span>
                                    </div>
                                    <div className="blog-inner-content">
                                        <h3 className="blog__title"><Link href="#">Mental Wellness Fund</Link>
                                        </h3>
                                        <p className="blog__desc"> Providing essential resources to support mental wellness and resilience for Eritrean and East African youth </p>
                                        <ul className="blog__list">
                                            <li><i className="icon-target"></i> Goal: <span>$10,000</span></li>
                                        </ul>
                                        <Link href="/donatenow" className="theme-btn">
                                            Donate Now
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Causes;
