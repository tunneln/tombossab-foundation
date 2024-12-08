import React, { useState } from 'react';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
      });
    
      const handleChange = (e) => {
        setFormData({
          ...formData,
          [e.target.name]: e.target.value,
        });
      };

      const handleSubmit = async (e) => {
        e.preventDefault(); // Prevents page reload on form submission
    
        try {
          const response = await fetch('/api/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
          });
    
          if (response.ok) {
            alert('Email sent successfully!');
          } else {
            alert('Error sending email.');
          }
        } catch (error) {
          console.error('Error:', error);
          alert('Error sending email.');
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
                            <form onSumbit={handleSubmit} method="post">
                                <div className="row">
                                    <div className="col-lg-6 col-sm-6 form-group">
                                        <input className="form-control" type="text" name="name" placeholder="Full Name" 
                                            value={formData.name} onChange={handleChange} required/>
                                    </div>

                                    <div className="col-lg-6 col-sm-6 form-group">
                                        <input className="form-control" type="email" name="email"
                                            value={formData.email} onChange={handleChange} placeholder="Email Address" required/>
                                    </div>

                                    <div className="col-lg-12 form-group">
                                        <input className="form-control" type="number" name="phone"
                                               value={formData.phone} onChange={handleChange} placeholder="Phone Number" required/>
                                    </div>

                                    <div className="col-lg-12 col-sm-12 form-group">
                                        <textarea className="textarea" name="message" placeholder="Write a Message" 
                                            value={formData.message} onChange={handleChange} required></textarea>
                                    </div>

                                    <div className="col-lg-12 col-sm-12">
                                        <button className="theme-btn submit__btn" type="submit">Send Message</button>
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
