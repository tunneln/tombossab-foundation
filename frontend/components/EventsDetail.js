import React from 'react';
import Map from "./Map";

const EventsDetail = () => {
    return (
        <section className="event-detail-area">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="blog-content">
                            <div className="blog-item">
                                <div className="blog-img">
                                    <img src="/images/img19.jpg" alt="" />
                            <span className="blog__tag">
                                <span className="date__num-text">26</span>
                                <span className="date__mon-text">jul</span>
                            </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-8">
                        <div className="event-detail-content">
                            <div className="event-detail-item">
                                <h3 className="event__title">Community Field Day</h3>
                                <p className="event__text">
                                    The Tombossa B Foundation will be holding its first annual fundraising event on <b>July 26th, 2025</b>! 
                                    Please join us at <b>Cottonwood Park</b> in Richardson, TX for an exciting, action-packed field day filled with games, prizes, food, and fun for all ages!
                                </p>
                                <p className="event__text">
                                    From <b>3PM to 9PM</b>, we’re turning the park into a community celebration with giant relay races, tug-of-war tournaments, water balloon challenges, sack races, and more field day favorites. 
                                    Bring the whole family to enjoy music, a bounce house for the kids, mouthwatering food off the grill, and sweet treats from our refreshment stands. 
                                    Feeling lucky? Don’t miss our raffle draw for an awesome prize giveaway at sunset! 
                                    All proceeds go toward supporting youth scholarships and mental health resources in our East African communities. Admission is free, but donations are warmly encouraged—every dollar helps change a life.     
                                </p>
                                <p className="event__text">
                                    <a href="https://lu.ma/5uc1kjtq">RSVP now</a> to help us plan-and come ready to play with a purpose!                                
                                </p>
                            </div>
                            <div className="event-detail-item">
                                <h3 className="event__title event__title2">Event Requirements</h3>
                                <ul style={{'listStyleType': 'disc', 'paddingLeft': '21px'}}>
                                    <li>RSVP is encouraged to help us plan for food, games, and seating. Walk-ins are welcome!</li>

                                    <li>All children must be accompanied by a parent or guardian at all times.</li>

                                    <li>Wear comfortable clothing and shoes suitable for outdoor games and walking.</li>

                                    <li>Bring sunscreen, water bottles, and blankets or lawn chairs for extra comfort.</li>

                                    <li>No alcohol or smoking is permitted in the park during the event.</li>

                                    <li>Cash and card payment options will be available for food, raffle tickets and donations.</li>
                                </ul>
                            </div>
                            <div className="event-detail-btn">
                                <a
                                href="https://lu.ma/event/evt-q1oBAS1S5wYduvT"
                                className="theme-btn"
                                data-luma-action="checkout"
                                data-luma-event-id="evt-q1oBAS1S5wYduvT"
                                >
                                    rsvp now
                                </a>
                            </div>
                            <script id="luma-checkout" src="https://embed.lu.ma/checkout-button.js"></script>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="event-detail-sidebar">
                            <div className="event-detail-item">
                                <h3 className="event__title">Event Details</h3>
                                <ul className="event__list">
                                    <li><span>Starting Time:</span> 3:00PM to 9:00PM</li>
                                    <li><span>Date:</span>26 July, 2025</li>
                                    <li><span>Category:</span>Fundraising</li>
                                    <li><span>Phone:</span>214 208 3936</li>
                                    <li><span>Location:</span>1301 W Belt Line Rd, Richardson, TX 75080</li>
                                </ul>
                            </div>
                            <div className="event-detail-item event-detail-item2">
                                <Map locationSrc="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3348.0746344180584!2d-96.7678758217657!3d32.9490388735923!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x864c21ced378273b%3A0x18f98485b7b8b5a3!2sCottonwood%20Park!5e0!3m2!1sen!2sus!4v1751504112834!5m2!1sen!2sus"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default EventsDetail;
