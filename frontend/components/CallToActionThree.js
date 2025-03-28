import React from 'react';
import Link from 'next/link';

const CallToActionThree = () => {
    return (
        <section className="cta-area cta-area2 text-center">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-lg-8 mx-auto">
                        <div className="cta-item">
                            <h3 className="cta__title">Become an Volunteer</h3>
                            <p className="cta__desc">Join your hand with us for a better life and future</p>
                            <Link href="/volunteer" className="theme-btn">join us now</Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CallToActionThree;
