import React, { useEffect } from 'react';
import Link from 'next/link';

const Donate = () => {

    return (
        <section className="donate-area2">
            <div className="container">
                <div className="row donate-content-wrap ml-auto">
                    <iframe
                    src="https://donorbox.org/embed/scholarship-fund-73?language=en-us"
                    name="donorbox"
                    allowpaymentrequest="allowpaymentrequest"
                    seamless="seamless"
                    frameBorder={0}
                    scrolling="no"
                    height="900px"
                    width="100%"
                    style={{ 'maxWidth': '500px', 'minWidth': '310px', 'maxHeight': "none!important" }}
                    allow="payment"
                    />
                    <div className="" style={{'maxWidth': '500px', 'minWidth': '310px'}}>
                        <div className="sidebar-shared">
                            <div className="side-widget blog-content">
                                <div className="blog-item">
                                    <div className="blog-img">
                                        <img src="/images/img1.jpg" alt="" />
                                    </div>
                                    <div className="blog-inner-content">
                                        <h3 className="blog__title"><Link href="#">Future Scholar Fund</Link>
                                        </h3>
                                        <p className="blog__desc"> Empowering Eritrean and East African youth via scholarships and prep resources to unlock education and potential </p>
                                        <ul className="blog__list">
                                            <li><i className="icon-target"></i> Goal: <span>$50,000</span></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="side-widget blog-content">
                                <div className="blog-item">
                                    <div className="blog-img">
                                        <img src="/images/img16.jpg" alt="" />
                                    </div>
                                    <div className="blog-inner-content">
                                        <h3 className="blog__title"><Link href="#">Mental Wellness Fund</Link>
                                        </h3>
                                        <p className="blog__desc"> Providing essential resources to support mental wellness and resilience for Eritrean and East African youth </p>
                                    </div>
                                </div>
                            </div>
                            <div className="side-widget">
                                <div className="author-box">
                                    <div className="author__avatar">
                                        <img src="/images/author-avatar.jpg" alt="" />
                                    </div>
                                    <div className="author__detail">
                                        <span className="author__meta">Created November 30, 2024</span>
                                        <h4 className="author__title">Organizer: <Link href="/team">Birkiti Kiflezion</Link></h4>
                                        <ul className="author__list">
                                            <li><i className="fa fa-map-marker"></i> Dallas, TX</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Donate;
