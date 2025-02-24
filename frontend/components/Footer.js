import React, { useState, useEffect } from 'react';

const Footer = () => {
    const [scrollBtn, setScrollBtn] = useState(false);

    const [formData, setFormData] = useState({
        email: '',
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
                    subject: "New Newsletter Subscription (temporary)",
                    body: "Email: " + formData.email,
                }),
                });
            
            if (!response.ok)
                throw new Error(`Error: ${response.statusText}`);

            alert('Successfully enrolled in subscription');
            setFormData({email: ''}) ;
        } catch (error) {
            console.error("Failed to send email:", error);
            alert('Failed to enroll in subscription');
        }
    }; 

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 100) {
                setScrollBtn(true);
            } else {
                setScrollBtn(false);
            }
        };
        
        window.addEventListener('scroll', handleScroll);
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const scrollTop = () => {
        window.scrollTo(0, 0);
    };

    return (
        <div>
            <section className="footer-area">
                <div className="newsletter-area">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-6 mx-auto text-center">
                                <div className="section-heading footer-heading">
                                    <div className="section-icon">
                                        <img src="/images/section-icon.png" alt="section-icon" />
                                    </div>
                                    <h2 className="section__title text__white">Newsletter</h2>
                                    <p className="section__meta">stay updated</p>
                                </div>
                                <div className="newsletter-form">
                                    <div className="form-shared">
                                        <form onSubmit={handleSubmit} method="post">
                                            <div className="row">
                                                <div className="col-lg-9">
                                                    <div className="form-group">
                                                        <input type="email" className="form-control" name="email"
                                                            value={formData.email} onChange={handleChange} placeholder="Email address" required />
                                                    </div>
                                                </div>
                                                <div className="col-lg-3">
                                                    <button className="theme-btn submit__btn"
                                                            type="submit">subscribe
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="footer-top">
                    <div className="container">
                        <div className="row footer-widget-wrap">
                            {/* Footer sections (about, explore, links, blog) */}
                            <div className="col footer-item footer-item1">
                                <h3 className="widget__title">contact</h3>
                                <ul className="contact__info">
                                    <li>7522 Overdale Drive <br />Dallas, TX 75254</li>
                                    <li><a href="tel:2142083936"><i className="fa fa-phone-square"></i> 214 208 3936</a></li>
                                    <li><a href="mailto:contact@tombossabfoundation.org" className="lower"><i className="fa fa-envelope" /> contact@tombossabfoundation.org</a></li>
                                </ul>
                                <div className="footer__social">
                                    <ul>
                                        <li><a rel="noopener noreferrer" target="_blank" href="https://x.com/TombossaBFound"><i className="fa fa-twitter"></i></a></li>
                                        <li><a rel="noopener noreferrer" target="_blank" href="https://www.facebook.com/share/g/14WErFWRzR/"><i className="fa fa-facebook"></i></a></li>
                                        <li><a rel="noopener noreferrer" target="_blank" href="https://www.instagram.com/tombossabfoundation"><i className="fa fa-instagram"></i></a></li>
                                        <li><a rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/@TombossaBFoundation"><i className="fa fa-youtube-play"></i></a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div onClick={scrollTop} id="back-to-top" className={scrollBtn ? 'back-btn-shown' : ''}>
                <i className="fa fa-angle-up" title="Go top"></i>
            </div>
        </div>
    );
};

export default Footer;
