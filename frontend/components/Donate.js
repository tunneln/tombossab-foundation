import React from 'react';
import Link from 'next/link';

const Donate = () => {
    return (
        <section className="donate-area2">
            <div className="container">
                <div className="row donate-content-wrap ml-auto">
                    <iframe
                    src="https://donorbox.org/embed/scholarship-fund-73?default_interval=o"
                    name="donorbox"
                    allowpaymentrequest="allowpaymentrequest"
                    seamless="seamless"
                    frameBorder={0}
                    scrolling="no"
                    height="900px"
                    width="100%"
                    style={{ maxWidth: 500, minWidth: 310, maxHeight: "none!important" }}
                    allow="payment"
                    />
                    <div className="ml-auto">
                        <div className="sidebar-shared">
                            <div className="side-widget blog-content">
                                <div className="blog-item">
                                    <div className="blog-img">
                                        <img src="/images/img15.jpg" alt="" />
                                    </div>
                                    <div className="blog-inner-content">
                                        <h3 className="blog__title"><Link href="#">Future Scholar Fund</Link>
                                        </h3>
                                        <p className="blog__desc">Aliq is notm hendr erit a augue insu image pellen tes.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="side-widget blog-content">
                                <div className="blog-item">
                                    <div className="blog-img">
                                        <img src="/images/img15.jpg" alt="" />
                                    </div>
                                    <div className="blog-inner-content">
                                        <h3 className="blog__title"><Link href="#">Mental Wellness Fund</Link>
                                        </h3>
                                        <p className="blog__desc">Aliq is notm hendr erit a augue insu image pellen tes.</p>
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
