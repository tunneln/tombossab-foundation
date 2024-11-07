import React from 'react';

const TeamArea = () => {
    return (
        <section className="team-area text-center">
            <div className="container">
                <div className="row">
                    <div className="col-lg-8 mx-auto">
                        <div className="section-heading">
                            <div className="section-icon">
                                <img src="/images/section-icon.png" alt="section-icon" />
                            </div>
                            <h2 className="section__title">Our Volunteers</h2>
                            <p className="section__meta">meet us</p>
                        </div>
                    </div>
                </div>
                <div className="row team-content-wrap">
                    <div className="col-lg-3 col-sm-6">
                        <div className="team-item team-item1">
                            <div className="team__img">
                                <img src="/images/birkiti.jpg" alt="team image" />
                                    <div className="team__img-links">
                                        <ul>
                                            <li><a href="#"><i className="fa fa-twitter"></i></a></li>
                                            <li><a href="#"><i className="fa fa-facebook"></i></a></li>
                                            <li><a href="#"><i className="fa fa-instagram"></i></a></li>
                                        </ul>
                                    </div>
                            </div>
                            <div className="team__title">
                                <h3 className="team__title-title"><a href="#">Birkiti Kiflezion</a></h3>
                                <span className="team__title-meta">President</span>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3 col-sm-6">
                        <div className="team-item team-item2">
                            <div className="team__img">
                                <img src="/images/hanna.jpg" alt="team image" />
                                    <div className="team__img-links">
                                        <ul>
                                            <li><a href="#"><i className="fa fa-twitter"></i></a></li>
                                            <li><a href="#"><i className="fa fa-facebook"></i></a></li>
                                            <li><a href="#"><i className="fa fa-instagram"></i></a></li>
                                        </ul>
                                    </div>
                            </div>
                            <div className="team__title">
                                <h3 className="team__title-title"><a href="#">Hanna Negusse</a></h3>
                                <span className="team__title-meta">volunteer</span>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3 col-sm-6">
                        <div className="team-item team-item3">
                            <div className="team__img">
                                <img src="/images/thomas.jpg" alt="team image" />
                                    <div className="team__img-links">
                                        <ul>
                                            <li><a href="#"><i className="fa fa-twitter"></i></a></li>
                                            <li><a href="#"><i className="fa fa-facebook"></i></a></li>
                                            <li><a href="#"><i className="fa fa-instagram"></i></a></li>
                                        </ul>
                                    </div>
                            </div>
                            <div className="team__title">
                                <h3 className="team__title-title"><a href="#">Thomas Negusse</a></h3>
                                <span className="team__title-meta">Volunteer</span>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3 col-sm-6">
                        <div className="team-item team-item4">
                            <div className="team__img">
                                <img src="/images/ariana.jpg" alt="team image" />
                                    <div className="team__img-links">
                                        <ul>
                                            <li><a href="#"><i className="fa fa-twitter"></i></a></li>
                                            <li><a href="#"><i className="fa fa-facebook"></i></a></li>
                                            <li><a href="#"><i className="fa fa-instagram"></i></a></li>
                                        </ul>
                                    </div>
                            </div>
                            <div className="team__title">
                                <h3 className="team__title-title"><a href="#">Ariana Negusse</a></h3>
                                <span className="team__title-meta">Marketing</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TeamArea;
