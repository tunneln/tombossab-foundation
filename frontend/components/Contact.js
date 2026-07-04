"use client";

import React, { useState } from 'react';
import { postJson } from '../lib/client-config';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
      });
    const [submitting, setSubmitting] = useState(false);

      const handleChange = (e) => {
        setFormData({
          ...formData,
          [e.target.name]: e.target.value,
        });
      };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevents page reload on form submission
        if (submitting) return; // guard against double-submit
        setSubmitting(true);

        try {
            // Structured fields only — the backend decides recipient and wording.
            await postJson('/api/contact', {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                message: formData.message,
            });

            alert('Message sent successfully!');
            window.location.reload();
        } catch (error) {
            console.error("Failed to send email:", error);
            alert('Error sending message.');
        } finally {
            setSubmitting(false);
        }
    };
    
    return (
        <section className="contact-area">
            <div className="container">
                <div className="row">
                    <div className="col-lg-6">
                        <div className="section-heading">
                            <div className="section-icon">
                                <img src="/images/section-icon.png" alt="section-icon" />
                            </div>
                            <h2 className="section__title">Get in Touch With Us</h2>
                            <p className="section__meta">Write a message</p>
                            <ul className="section__list">
                                <li><a rel="noopener noreferrer" target="_blank" href="https://x.com/TombossaBFound"><i className="fa fa-twitter"></i></a></li>
                                <li><a rel="noopener noreferrer" target="_blank" href="https://www.facebook.com/share/g/14WErFWRzR/"><i className="fa fa-facebook"></i></a></li>
                                <li><a rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/@TombossaBFoundation"><i className="fa fa-youtube-play"></i></a></li>
                                <li><a rel="noopener noreferrer" target="_blank" href="https://www.instagram.com/tombossabfoundation"><i className="fa fa-instagram"></i></a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="form-shared">
                            <form onSubmit={handleSubmit} method="post">
                                <div className="row">
                                    <div className="col-lg-6 col-sm-6 form-group">
                                        <input className="form-control" type="text" name="name" placeholder="Full Name" maxLength={200}
                                            value={formData.name} onChange={handleChange} required/>
                                    </div>

                                    <div className="col-lg-6 col-sm-6 form-group">
                                        <input className="form-control" type="email" name="email" maxLength={320}
                                            value={formData.email} onChange={handleChange} placeholder="Email Address" required/>
                                    </div>

                                    <div className="col-lg-12 form-group">
                                        <input className="form-control" type="tel" name="phone" maxLength={40}
                                               value={formData.phone} onChange={handleChange} placeholder="Phone Number" required/>
                                    </div>

                                    <div className="col-lg-12 col-sm-12 form-group">
                                        <textarea className="textarea" name="message" placeholder="Write a Message" maxLength={5000}
                                            value={formData.message} onChange={handleChange} required></textarea>
                                    </div>

                                    <div className="col-lg-12 col-sm-12">
                                        <button className="theme-btn submit__btn" type="submit" disabled={submitting}>Send Message</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="row contact-detail-action">
                    <div className="col-lg-4">
                        <div className="contact-item contact-item1">
                            <h3 className="contact__title">About</h3>
                            <p className="contact__desc">
                               Please feel free to leave us a message if you have any questions or would like to volunteer!
                            </p>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="contact-item contact-item2">
                            <h3 className="contact__title">Address</h3>
                            <p className="contact__desc" >
                                7522 Overdale Drive <br />
                                Dallas, TX 75254
                            </p>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="contact-item contact-item3">
                            <h3 className="contact__title">Contact</h3>
                            <p className="contact__desc">
                                contact@tombossabfoundation.org <br />
                                214 208 3936
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
