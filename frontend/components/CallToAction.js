import React from 'react';
import Link from 'next/link';

const CallToAction = () => {
    return (
        <section className="mixer-area mixer-area3 text-center">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="section-heading mixer-heading">
                            <div className="section-icon">
                                <img src="/images/section-icon.png" alt="section-icon" />
                            </div>
                            <h2 className="section__title text__white">The helping hand we extend to the lives we touch never
                                fade</h2>
                            <Link href="/donatenow" className="theme-btn custom-dbox-popup" data-reminder-widget-enabled="true">
                                <img src="https://donorbox.org/images/white_logo.svg"/> &nbsp;Donate
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CallToAction;
