import React from 'react';
import Link from 'next/link';

const Error = () => {
    return (
        <section className="blog-area blog-area2">
            <div className="container">
                <div className="row">
                    <div className="col-lg-8 mx-auto">
                        <div className="section-heading blog-heading text-center">
                            <h2 className="section__title">Sorry, this page isn't available</h2>
                            <p className="section__meta" style={{'color': 'darkgrey'}}>The link you followed may be broken or the page may have been removed. Click <Link href="/">here</Link> to go home.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Error;
