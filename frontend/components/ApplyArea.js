import React from 'react';
import Link from 'next/link';

const ApplyArea = () => {
    return (
        <section className="about-area">
        <div className="container">
            <div className="row">
                <div className="col-lg-12 mobile-about-banner">
                    <div className="about-large-img">
                        <img src="/images/about-img.jpg" alt="" />
                    </div>
                </div>
                <div className="about-heading">
                    <div className="section-heading">
                        {/* <div className="section-icon">
                            <img src="/images/section-icon.png" alt="section-icon" />
                        </div> */}
                        <h2 className="section__title">East African Youth Scholarship Application</h2>
                        <p className="section__meta">Empowering Future Leaders in STEM and Business</p>
                        <p className="section__desc">
                        Welcome to the East African Youth Scholarship Program! We are dedicated to supporting East African youth living in North Texas as they pursue higher education in <b>STEM (Science, Technology, Engineering, Mathematics) and Business</b> fields. This scholarship aims to nurture future leaders and innovators by providing financial assistance to help cover tuition, fees, and other educational expenses.
                        </p> <hr/>

                        <h3 className="section__desc"> Eligibility Criteria </h3> <br/>
                        <p> <b>To apply for the scholarship, applicants must: </b> </p> <br/>
                        <ol style={{'paddingLeft': '40px'}}>
                            <li style={{'paddingLeft': '10px'}}><b>Heritage:</b> Be of East African descent (e.g. Eritrea or Ethiopia). </li>
                            <li style={{'paddingLeft': '10px'}}><b>Residence:</b> Reside in <b>North Texas</b> at the time of application. </li>
                            <li style={{'paddingLeft': '10px'}}><b>Educational Goals:</b> Be enrolled or planning to enroll in an accredited technical college, university, or vocational school in a <b>STEM or Business-related program</b>. </li>
                            <li style={{'paddingLeft': '10px'}}><b>Academic Standing:</b> Demonstrate a minimum GPA of <b>3.2 on a 4.0 scale</b> (or equivalent). </li>
                            <li style={{'paddingLeft': '10px'}}><b>Community Engagement:</b> Show active involvement in community service, leadership, or extracurricular activities. </li>
                            <li style={{'paddingLeft': '10px'}}><b>Financial Need:</b> Establish financial status. </li>
                        </ol> <hr/>

                        <h3 className="section__desc"> Scholarship Benefits </h3> <br/> 
                        <p> <b>Recipients of the East African Youth Scholarship will receive:</b> </p> <br/>
                        <div style={{'paddingLeft': '40px'}}>
                            <li> Award of <b>$2,000 per academic semester. </b> Up to $4000 a year contigent upon continued eligibility for two semesters.</li>
                                <ul> 
                                    <li style={{'paddingLeft': '40px'}}> Applications must be resubmitted every two semesters.</li>
                                </ul>
                            <li>Mentorship opportunities with professionals in STEM and Business fields. </li>
                            <li>Networking events and workshops to support personal and professional growth. </li>
                        </div> <hr/>
                        
                        <h3 className="section__desc"> Application Requirements </h3> <br/>
                        <p> <b>Applicants must submit the following:</b> </p> <br/>
                            <ol style={{'paddingLeft': '40px'}}>
                                <li style={{'paddingLeft': '10px'}}> <b>Completed Resume:</b> Be sure to provide accurate and up-to-date personal and academic information. </li>
                                <li style={{'paddingLeft': '10px'}}> <b>Personal Statement (500 - 750 words):</b> Share your story, including: </li>
                                    <ul style={{'paddingLeft': '40px'}}>
                                        <li> Your East African heritage and its significance to your goals.</li>
                                        <li> Why you chose a STEM or Business field.</li>
                                        <li> Your career aspirations and how this scholarship will help you achieve them.</li>
                                    </ul>
                                <li style={{'paddingLeft': '10px'}}> <b>Proof of Residency:</b> Submit a copy of a utility bill, lease agreement, or other official documentation verifying your address in North Texas. </li>
                                <li style={{'paddingLeft': '10px'}}> <b>Academic Transcript:</b>  Submit an official transcript from your current or most recent school. </li>
                                <li style={{'paddingLeft': '10px'}}> <b>One Letter of Recommendation:</b> The letter can be from a teacher, counselor, or employer. </li>
                                <li style={{'paddingLeft': '10px'}}> <b>Financial Documentation:</b> Provide evidence of financial need (e.g. FAFSA report, tax returns, or a letter explaining your financial circumstances). </li>
                        </ol> <hr/>

                        <h3 className="section__desc"> Application Process </h3> <br/>
                        <ol style={{'paddingLeft': '40px'}}>
                            <li style={{'paddingLeft': '10px'}}> <b>Deadline:</b> All application materials must be submitted by <b>May 31st</b>. </li>
                            <li style={{'paddingLeft': '10px'}}> <b>Submission:</b> Applications documents may be submitted <a href="https://forms.gle/vAoHkZkdNo8gZmGH8" target="_blank" rel="noopener noreferrer"><b>here</b></a> or via email to <a href="mailto:apply@tombossabfoundation.org" className="lower"><b>apply@tombossabfoundation.org</b></a>. </li>
                            <li style={{'paddingLeft': '10px'}}> <b>Selection Process:</b> Applications will be reviewed by a scholarship committee, and finalists may be invited for an interview. </li>
                            <li style={{'paddingLeft': '10px'}}> <b>Notification:</b> Scholarship recipients will be notified by <b>July 18.</b> </li>
                        </ol> 
                        <br />
                        <Link  href="https://forms.gle/vAoHkZkdNo8gZmGH8" target="_blank" rel="noopener noreferrer" className="theme-btn">
                            Apply Now
                        </Link>

                        <hr />
                        <h3 className="section__desc"> Questions </h3> <br/>
                        <p> <b>For questions or additional information, you contact us at:</b> </p> <br/>
                        <div style={{'paddingLeft': '40px'}}>
                            <li> <a href="mailto:contact@tombossabfoundation.org" className="lower"><i className="fa fa-envelope" /> contact@tombossabfoundation.org</a></li>
                            <li> <a href="tel:2142083936"><i className="fa fa-phone-square" /> 214 208 3936</a> </li>
                        </div><hr/>

                        <br/>
                        Join us in empowering the next generation of East African leaders in North Texas. Apply today and take the next step toward achieving your educational and professional dreams!
                    </div>

                </div>
            </div>
        </div>
    </section>
    );
};

export default ApplyArea;