import React from 'react';
import DonateButton from './DonateButton';

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
                                fades</h2>
                            <DonateButton className="theme-btn" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CallToAction;
