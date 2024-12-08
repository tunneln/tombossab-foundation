import React, { useState } from 'react';

const Volunteer = () => {

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        job: '',
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
            const response = await fetch("/api/emails/send", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    to: "contact@tombossabfoundation.org",
                    subject: "Volunteer Form From " + formData.name,
                    body: "Name: " + formData.name + "\nPhone: " + formData.phone + "\nEmail: " + formData.email + "\nOccupation: " + formData.job + "\nAddress: " + formData.address + "\nMessage: " + formData.message,
                }),
                });
            
            if (!response.ok)
                throw new Error(`Error: ${response.statusText}`);

            alert('Volunteer registration form received successfully!');
            setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    address: '',
                    job: '',
                    message: '',
                });
        } catch (error) {
            console.error("Failed to send email:", error);
            alert('Failed to receive volunteer registration form');
        }
    }; 

    return (
        <section className="contact-form-area register-area">
            <div className="container">
                <div className="row">
                    <div className="col-lg-8 mx-auto">
                        <div className="section-heading text-center">
                            <div className="section-icon">
                                <img src="/images/section-icon.png" alt="section-icon" />
                            </div>
                            <h2 className="section__title">Register Now</h2>
                            <p className="section__meta">join us now</p>
                        </div>
                    </div>
                </div>
                <div className="row form-shared-wrap">
                    <div className="col-lg-6">
                        <div className="form-shared-content">
                            <div className="form-img">
                                <img src="/images/form-img.jpg" alt="" />
                            </div>
                            <div className="form-content">
                                <h3 className="form__title">Interested In Volunteering?</h3>
                                <p className="form__desc">
                                    Reach out and learn how we can make a difference together!
                                </p>
                                {/* <ul className="form__list">
                                    <li><i className="fa fa-check"></i> Eos ei nisl graecis vix aperiri consequat</li>
                                    <li><i className="fa fa-check"></i> Alienum phaedrum torquatos</li>
                                    <li><i className="fa fa-check"></i> Dius lorem tincidunt vixat</li>
                                </ul> */}
                                <div className="contact-us-box">
                                    <div className="contact__item">
                                        <h4>Call us</h4>
                                        <a href="tel:2142083936">214 208 3936</a>
                                    </div>
                                    <div className="contact__item contact__item2">
                                        <h4>Send email</h4>
                                        <a href="mailto:contact@tombossabfoundation.org">contact@tombossabfoundation.org</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="form-shared">
                            <form onSubmit={handleSubmit} method="post">
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="form-group">
                                            <input type="text" className="form-control" placeholder="Full Name" name="name"
                                                value={formData.name} onChange={handleChange} required/>
                                        </div>
                                    </div>
                                    <div className="col-lg-12">
                                        <div className="form-group">
                                            <input type="email" className="form-control" placeholder="Email Address" name="email"
                                                value={formData.email} onChange={handleChange} required/>
                                        </div>
                                    </div>
                                    <div className="col-lg-12">
                                        <div className="form-group">
                                            <input type="number" className="form-control" placeholder="Phone Number" name="phone"
                                                value={formData.phone} onChange={handleChange} required/>
                                        </div>
                                    </div>
                                    <div className="col-lg-12">
                                        <div className="form-group">
                                            <input type="text" className="form-control" placeholder="Address" name="address"
                                                value={formData.address} onChange={handleChange} />
                                        </div>
                                    </div>
                                    <div className="col-lg-12">
                                        <div className="form-group">
                                            <input type="text" className="form-control" placeholder="Occupation" name="job"
                                                value={formData.job} onChange={handleChange} />
                                        </div>
                                    </div>
                                    <div className="col-lg-12">
                                        <div className="form-group">
                                            <textarea className="textarea" name="message"
                                                value={formData.message} onChange={handleChange} placeholder="Write a Message" required></textarea>
                                        </div>
                                    </div>
                                    <div className="col-lg-12">
                                        <button className="theme-btn submit__btn" type="submit">send message</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Volunteer;
