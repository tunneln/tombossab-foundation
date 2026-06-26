import React from 'react';
import Map from "./Map";

const CoffeeWomenEmpowermentEventDetail = () => {
    return (
        <section className="event-detail-area">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="blog-content text-center">
                            <div className="blog-item">
                                <div className="blog-img">
                                    <img src="/images/coffee-women-empowerment.jpg" className="image_full" alt="Coffee & Women Empowerment Event" />
                                    <img src="/images/coffee-women-empowerment-poster.jpg" className="image_mobile" alt="Coffee & Women Empowerment Event Mobile" />
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
                                <h3 className="event__title">Coffee &amp; Women Empowerment Gathering</h3>
                                <p className="event__text">
                                    We are honored to welcome <b>Dr. Yacob Tekie</b>, founder of Tesfa-House Psychotherapy & Consulting, as
                                    our guest speaker for our first ever Women&rsquo;s Empowerment & Coffee Gathering. <b>Dr. Tekie</b> is a
                                    licensed psychologist, educator, and advocate whose work promotes mental health, resilience, and healing
                                    within diverse, multicultural communities. Through <b>Tesfa-House</b>, he provides compassionate, evidence-based,
                                    culturally sensitive care while working to reduce stigma and expand access to mental health services. We encourage
                                    our community to explore the resources and educational materials available through his organization.
                                </p>
                                <p className="event__text">
                                    The Tombossa B Foundation invites you to <b>Coffee &amp; Women Empowerment</b>, a warm gathering for women to come
                                    together, talk, and support each other&rsquo;s well-being. Join us on <b>Saturday, June 27th, 2025</b> from <b>2PM to 6PM </b>
                                    at <b>7522 Overdale Drive</b> for an inspiring afternoon of connection, conversation, and community.
                                </p>
                                <p className="event__text">
                                    Whether you come to listen, to share, or simply to enjoy a cup of coffee in good company, you are welcome here. Bring a friend,
                                    bring yourself, and let&rsquo;s lift one another up. Life can be heavy sometimes, and having a safe space to share and listen can
                                    make a big difference&mdash;come find that space with us.
                                </p>
                            </div>
                            <div className="event-detail-item">
                                <h3 className="event__title event__title2">What to Expect</h3>
                                <ul style={{'listStyleType': 'disc', 'paddingLeft': '21px'}}>
                                    <li>Coffee, refreshments, and a welcoming, judgment-free space.</li>
                                    <li>An encouraging talk from our guest speaker, Dr. Yacob Tekie.</li>
                                    <li>Open conversation on personal growth, well-being, and empowerment.</li>
                                    <li>An opportunity to connect with other women in the East African community.</li>
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

export default CoffeeWomenEmpowermentEventDetail;
