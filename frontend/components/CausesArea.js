import React from 'react';
import Link from 'next/link';

const CausesArea = () => {
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
                                <p className="section__meta">help us now</p>
                            </div>
                        </div>
                    </div>
                    <div className="row blog-content-wrap">
                        <div className="col-lg-4">
                            <div className="blog-content">
                                <div className="blog-item blog-item1">
                                    <div className="blog-img">
                                        <img src="/images/img1.jpg" alt="" />
                                    </div>
                                    <div id="bar1" className="barfiller">
                                        <div className="tipWrap">
                                            <span className="tip"></span>
                                        </div>
                                        <span className="fill" data-percentage="23"></span>
                                    </div>
                                    <div className="blog-inner-content">
                                        <h3 className="blog__title"><Link href="/causes-detail">Save Poor Childrens</Link>
                                        </h3>
                                        <p className="blog__desc">Aliq is notm hendr erit a augue insu image pellen
                                            tes.</p>
                                        <ul className="blog__list">
                                            <li><i className="icon-target"></i> Goal: <span>$30,000</span></li>
                                            <li><i className="fa fa-line-chart"></i> Raised: <span>25,270</span></li>
                                        </ul>
                                        <Link href="/donate" className="theme-btn">donate now</Link>
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
                                    <div id="bar2" className="barfiller">
                                        <div className="tipWrap">
                                            <span className="tip"></span>
                                        </div>
                                        <span className="fill" data-percentage="80"></span>
                                    </div>
                                    <div className="blog-inner-content">
                                        <h3 className="blog__title"><Link href="/causes-detail">They Want to Study</Link>
                                        </h3>
                                        <p className="blog__desc">Aliq is notm hendr erit a augue insu image pellen
                                            tes.</p>
                                        <ul className="blog__list">
                                            <li><i className="icon-target"></i> Goal: <span>$30,000</span></li>
                                            <li><i className="fa fa-line-chart"></i> Raised: <span>25,270</span></li>
                                        </ul>
                                        <Link href="/donate" className="theme-btn">donate now</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="blog-content">
                                <div className="blog-item blog-item3">
                                    <div className="blog-img">
                                        <img src="/images/img3.jpg" alt="" />
                                    </div>
                                    <div id="bar3" className="barfiller">
                                        <div className="tipWrap">
                                            <span className="tip"></span>
                                        </div>
                                        <span className="fill" data-percentage="44"></span>
                                    </div>
                                    <div className="blog-inner-content">
                                        <h3 className="blog__title"><Link href="/causes-detail">Healthy Food for
                                            All</Link></h3>
                                        <p className="blog__desc">Aliq is notm hendr erit a augue insu image pellen
                                            tes.</p>
                                        <ul className="blog__list">
                                            <li><i className="icon-target"></i> Goal: <span>$30,000</span></li>
                                            <li><i className="fa fa-line-chart"></i> Raised: <span>25,270</span></li>
                                        </ul>
                                        <Link href="/donate" className="theme-btn">donate now</Link> 
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

export default CausesArea;
