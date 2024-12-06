import React, {Component} from 'react';

class FaqArea extends Component {

    componentDidMount() {
        new Accordion('.accordion-container');
    }

    render() {
        return (
            <section className="faq-area">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="section-heading">
                                <div className="section-icon">
                                    <img src="/images/section-icon.png" alt="section-icon" />
                                </div>
                                <h2 className="section__title">Have any Questions?</h2>
                                <p className="section__meta">frequently asked questions</p>
                            </div>
                            <div className="faq-img-box">
                                <img src="/images/faq-img.jpg" alt="" />
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="accordion-container">
                                <div className="ac">
                                    <h2 className="ac-q" tabIndex="0">How do I apply for a scholarship?</h2>
                                    <div className="ac-a">
                                        <p className="accordion__content-desc">
                                            As we are still taking our first steps as a foundation, we won't be opening applcations until the end of 2025 at the earliest.
                                        </p>
                                    </div>
                                </div>

                                <div className="ac">
                                    <h2 className="ac-q" tabIndex="0">What is the overall vision for the foundation</h2>
                                    <div className="ac-a">
                                        <p className="accordion__content-desc">
                                            While there's much we can say here, our primary objective can be summed up as the following:<br/><br/>
                                            To enhance the strength and well-being of the Eritrean and East African youth community by providing accessible resources and financial aid.
                                        </p>
                                    </div>
                                </div>

                                <div className="ac">
                                    <h2 className="ac-q" tabIndex="0">How can I support the foundation?</h2>
                                    <div className="ac-a">
                                        <p className="accordion__content-desc">
                                            You can support by making a donation, volunteering, or spreading the word about our mission. More information can be found in the Get Involved navigation tab!
                                        </p>
                                    </div>
                                </div>

                                <div className="ac">
                                    <h2 className="ac-q" tabIndex="0">Do you offer support beyond scholarships?</h2>
                                    <div className="ac-a">
                                        <p className="accordion__content-desc">
                                            Yes, we also provide mentorship, mental wellness resources, and community programs aimed at supporting holistic student success.
                                        </p>
                                    </div>
                                </div>

                                <div className="ac">
                                    <h2 className="ac-q" tabIndex="0">What does the 'B' in Tombossa B Foundation stand for?</h2>
                                    <div className="ac-a">
                                        <p className="accordion__content-desc">
                                            The 'B' stands for Birkiti. As the president of the foundation and wife of Tombossa, Birkiti created this organization to honor her late husband and his commitment to helping the Eritrean community.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

export default FaqArea;