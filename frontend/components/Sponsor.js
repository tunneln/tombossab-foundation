import React from 'react';
import Link from 'next/link';

const Sponsor = () => {
    return (
        <section className="sponsor-area">
            <div className="container">
                <div className="row">
                    <div className="col-lg-8 mx-auto text-center">
                        <div className="section-heading">
                            <div className="section-icon">
                                <img src="/images/section-icon.png" alt="section-icon" />
                            </div>
                            <h2 className="section__title">Partner with us</h2>
                            <p className="section__meta">become a sponsor</p>
                        </div>
                        <p style={{ color: '#666', fontSize: '1.05rem', lineHeight: 1.75, margin: '1.5rem 0 2.5rem' }}>
                            Sponsorships help fund our scholarships and community programs. If your
                            organization would like to support the Tombossa B Foundation, we would
                            love to hear from you.
                        </p>
                        <Link href="/contact" className="theme-btn">Get in touch</Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Sponsor;
