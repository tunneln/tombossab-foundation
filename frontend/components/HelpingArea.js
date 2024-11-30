import React from 'react';

const HelpingArea = () => {

    return (
        <div>
            <section className="mixer-area helping-area">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="section-heading mixer-heading">
                                <div className="section-icon">
                                    <img src="/images/section-icon.png" alt="section-icon" />
                                </div>
                                <h2 className="section__title">Give a helping hand to children in need</h2>
                            </div>
                            <div className="helping-item">
                                <div className="row">
                                    <div className="col">
                                        <div className="helping-box helping-box1">
                                            <i className="icon-hamburger"></i>
                                            <h4>food</h4>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="helping-box helping-box2">
                                            <i className="icon-water-bottle"></i>
                                            <h4>water</h4>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="helping-box helping-box3">
                                            <i className="icon-health"></i>
                                            <h4>Medical</h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="helping-text-box">
                                <p className="helping__text">
                                    Your support is not just a gift—it's a lifeline that helps ensure a brighter, healthier future for the next generation. Thank you for being a part of this important journey. Through you, our communities youths are empowered to overcome challenges, build resilience, and reach their full potential.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="mixer-area2 helping-area2">
                <div className="container">
                    <div className="row fun-content-wrap">
                        <div className="col-lg-6">
                            <div className="fun-content">
                                <div className="fun-item fun-item1">
                                    <img src="/images/helping-img.jpg" alt="" />
                                </div>
                                <div className="section-heading">
                                    <div className="section-icon">
                                        <img src="/images/section-icon.png" alt="section-icon" />
                                    </div>
                                    <h2 className="section__title">Our Vision</h2>
                                    <p className="section__desc">
                                        Our nonprofit is committed to providing support to children and young adults in the Eritrean and East African community by offering access to educational resources, mental wellness programs, and mentorship opportunities. We aim to empower the next generation through scholarships, mental health initiatives, and community-driven projects that foster personal growth, resilience, and long-term success. By creating a network of support, we help these youth navigate challenges and unlock their full potential. 
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="helping-form">
                                <div className="section-heading">
                                    <div className="section-icon">
                                        <img src="/images/section-icon.png" alt="section-icon" />
                                    </div>
                                    <h2 className="section__title text__white" style={{'paddingBottom': '30px'}}>Recent Donations!</h2>
                                </div>
                                <iframe 
                                    frameBorder={0}
                                    name="donorbox" 
                                    scrolling="auto" 
                                    seamless="seamless" 
                                    src="https://donorbox.org/embed/scholarship-fund-73?only_donor_wall=true&donor_wall_color=%2363ae3b" 
                                    style={{ 'width': '100%', 'maxWidth': '500px', 'minWidth': '310px', 'minHeight': '345px' }}/> 
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HelpingArea;
