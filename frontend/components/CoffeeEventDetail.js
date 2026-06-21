import React from 'react';
import Map from "./Map";

const CoffeeEventDetail = () => {
    return (
        <section className="event-detail-area">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="blog-content text-center">
                            <div className="blog-item">
                                <div className="blog-img" style={{ display: 'inline-block', position: 'relative' }}>
                                    <a href="/images/coffee-women-empowerment.jpg" target="_blank" rel="noopener noreferrer">
                                        <img
                                            src="/images/coffee-women-empowerment.jpg"
                                            alt="Coffee & Women Empowerment event poster"
                                            style={{ maxWidth: '480px', width: '100%', height: 'auto', borderRadius: '6px' }}
                                        />
                                    </a>
                                    <span className="blog__tag">
                                        <span className="date__num-text">27</span>
                                        <span className="date__mon-text">jun</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-8">
                        <div className="event-detail-content">
                            <div className="event-detail-item">
                                <h3 className="event__title">Coffee &amp; Women Empowerment</h3>
                                <p className="event__text">
                                    The Tombossa B Foundation invites you to <b>Coffee &amp; Women Empowerment</b>, a warm coffee gathering for women to
                                    come together, talk, and support each other&rsquo;s well-being. Join us on <b>Saturday, June 27th, 2025</b> from <b>2PM to 6PM</b> at
                                    <b> 7522 Overdale Dr., Dallas, TX 75254</b> for an afternoon of coffee, conversation, and encouragement.
                                </p>
                                <p className="event__text">
                                    We&rsquo;re honored to welcome our guest speaker, <b>Dr. Yacob Tekie</b>, who will share insight and encouragement to
                                    uplift and empower the women in our community. Life can be heavy sometimes, and having a safe space to share and
                                    listen can make a big difference&mdash;come find that space with us.
                                </p>
                                <p className="event__text">
                                    Whether you come to listen, to share, or simply to enjoy a cup of coffee in good company, you are welcome here.
                                    Bring a friend, bring yourself, and let&rsquo;s lift one another up.
                                </p>
                            </div>
                            <div className="event-detail-item">
                                <h3 className="event__title event__title2">What to Expect</h3>
                                <ul style={{'listStyleType': 'disc', 'paddingLeft': '21px'}}>
                                    <li>An encouraging talk from our guest speaker, Dr. Yacob Tekie.</li>
                                    <li>Coffee, refreshments, and a welcoming, judgment-free space.</li>
                                    <li>Open conversation focused on women&rsquo;s well-being and community support.</li>
                                    <li>An opportunity to connect with other women in the East African community.</li>
                                    <li>All women are welcome&mdash;feel free to bring a friend.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="event-detail-sidebar">
                            <div className="event-detail-item">
                                <h3 className="event__title">Event Details</h3>
                                <ul className="event__list">
                                    <li><span>Starting Time:</span> 2:00PM to 6:00PM</li>
                                    <li><span>Date:</span>27 June, 2025</li>
                                    <li><span>Guest Speaker:</span>Dr. Yacob Tekie</li>
                                    <li><span>Category:</span>Community &amp; Empowerment</li>
                                    <li><span>Phone:</span>214 208 3936</li>
                                    <li><span>Location:</span>7522 Overdale Dr., Dallas, TX 75254</li>
                                </ul>
                            </div>
                            <div className="event-detail-item event-detail-item2">
                                <Map locationSrc="https://maps.google.com/maps?q=7522+Overdale+Dr,+Dallas,+TX+75254&output=embed"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CoffeeEventDetail;
