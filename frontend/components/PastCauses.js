import React from 'react';
import Link from 'next/link';

const PastCauses = () => {

    return (
        <div>
            <section className="causes-area past-causes-area">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8 mx-auto">
                            <div className="section-heading blog-heading text-center">
                                <div className="section-icon">
                                    <img src="/images/section-icon.png" alt="section-icon" />
                                </div>
                                <h2 className="section__title">Past Causes</h2>
                            </div>
                        </div>
                    </div>
                    <div className="row blog-content-wrap">
                        <div className="col-lg-4">
                            <h3 className="blog__title">No past causes yet!</h3>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default PastCauses;
