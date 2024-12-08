import React, {useEffect} from 'react';
import Link from 'next/link';

const Gallery = () => {

    useEffect(() => {
        const lightbox = GLightbox({
            touchNavigation: true,
            loop: true,
            autoplayVideos: true,
            beforeSlideLoad: (slide, data) => {
                // For executing a script in the slide
            }
        });
    });

    return (
        <section className="gallery-area2">
            <div className="container">
                <div className="row">
                    <div className="col-lg-4 col-sm-6">
                        <div className="gallery-item">
                            <img src="/images/gallery-img4.jpg" alt="" />
                            <a href="images/gallery-img4.jpg" className="glightbox">
                                <span className="gallery-icon"></span></a>
                        </div>
                    </div>
                    <div className="col-lg-4 col-sm-6">
                        <div className="gallery-item">
                            <img src="/images/gallery-img34.jpg" alt="" />
                            <a href="images/gallery-img34.jpg" className="glightbox">
                                <span className="gallery-icon"></span></a>
                        </div>
                    </div>
                    <div className="col-lg-4 col-sm-6">
                        <div className="gallery-item">
                            <img src="/images/gallery-img5.jpg" alt="" />
                            <a href="images/gallery-img5.jpg" className="glightbox">
                                <span className="gallery-icon"></span></a>
                        </div>
                    </div>
                    <div className="col-lg-4 col-sm-6">
                        <div className="gallery-item">
                            <img src="/images/gallery-img6.jpg" alt="" />
                            <a href="images/gallery-img6.jpg" className="glightbox">
                                <span className="gallery-icon"></span></a>
                        </div>
                    </div>
                    <div className="col-lg-4 col-sm-6">
                        <div className="gallery-item">
                            <img src="/images/gallery-img7.jpg" alt="" />
                            <a href="images/gallery-img7.jpg" className="glightbox">
                                <span className="gallery-icon"></span></a>
                        </div>
                    </div>
                    <div className="col-lg-4 col-sm-6">
                        <div className="gallery-item">
                            <img src="/images/gallery-img8.jpg" alt="" />
                            <a href="images/gallery-img8.jpg" className="glightbox">
                                <span className="gallery-icon"></span></a>
                        </div>
                    </div>
                    <div className="col-lg-4 col-sm-6">
                        <div className="gallery-item">
                            <img src="/images/gallery-img9.jpg" alt="" />
                            <a href="images/gallery-img9.jpg" className="glightbox">
                                <span className="gallery-icon"></span></a>
                        </div>
                    </div>
                    <div className="col-lg-4 col-sm-6">
                        <div className="gallery-item">
                            <img src="/images/gallery-img10.jpg" alt="" />
                            <a href="images/gallery-img10.jpg" className="glightbox">
                                <span className="gallery-icon"></span></a>
                        </div>
                    </div>
                    <div className="col-lg-4 col-sm-6">
                        <div className="gallery-item">
                            <img src="/images/gallery-img11.jpg" alt="" />
                            <a href="images/gallery-img11.jpg" className="glightbox">
                                <span className="gallery-icon"></span></a>
                        </div>
                    </div>
                    <div className="col-lg-4 col-sm-6">
                        <div className="gallery-item">
                            <img src="/images/gallery-img12.jpg" alt="" />
                            <a href="images/gallery-img12.jpg" className="glightbox">
                                <span className="gallery-icon"></span></a>
                        </div>
                    </div>
                    <div className="col-lg-4 col-sm-6">
                        <div className="gallery-item">
                            <img src="/images/gallery-img13.jpg" alt="" />
                            <a href="images/gallery-img13.jpg" className="glightbox">
                                <span className="gallery-icon"></span></a>
                        </div>
                    </div>
                    <div className="col-lg-4 col-sm-6">
                        <div className="gallery-item">
                            <img src="/images/gallery-img14.jpg" alt="" />
                            <a href="images/gallery-img14.jpg" className="glightbox">
                                <span className="gallery-icon"></span></a>
                        </div>
                    </div>
                    <div className="col-lg-4 col-sm-6">
                        <div className="gallery-item">
                            <img src="/images/gallery-img15.jpg" alt="" />
                            <a href="images/gallery-img15.jpg" className="glightbox">
                                <span className="gallery-icon"></span></a>
                        </div>
                    </div>
                    <div className="col-lg-4 col-sm-6">
                        <div className="gallery-item">
                            <img src="/images/gallery-img16.jpg" alt="" />
                            <a href="images/gallery-img16.jpg" className="glightbox">
                                <span className="gallery-icon"></span></a>
                        </div>
                    </div>
                    <div className="col-lg-4 col-sm-6">
                        <div className="gallery-item">
                            <img src="/images/gallery-img17.jpg" alt="" />
                            <a href="images/gallery-img17.jpg" className="glightbox">
                                <span className="gallery-icon"></span></a>
                        </div>
                    </div>
                    <div className="col-lg-4 col-sm-6">
                        <div className="gallery-item">
                            <img src="/images/gallery-img18.jpg" alt="" />
                            <a href="images/gallery-img18.jpg" className="glightbox">
                                <span className="gallery-icon"></span></a>
                        </div>
                    </div>
                    <div className="col-lg-4 col-sm-6">
                        <div className="gallery-item">
                            <img src="/images/gallery-img19.jpg" alt="" />
                            <a href="images/gallery-img19.jpg" className="glightbox">
                                <span className="gallery-icon"></span></a>
                        </div>
                    </div>
                    <div className="col-lg-4 col-sm-6">
                        <div className="gallery-item">
                            <img src="/images/gallery-img20.jpg" alt="" />
                            <a href="images/gallery-img20.jpg" className="glightbox">
                                <span className="gallery-icon"></span></a>
                        </div>
                    </div>
                    <div className="col-lg-4 col-sm-6">
                        <div className="gallery-item">
                            <img src="/images/gallery-img21.jpg" alt="" />
                            <a href="images/gallery-img21.jpg" className="glightbox">
                                <span className="gallery-icon"></span></a>
                        </div>
                    </div>
                    <div className="col-lg-4 col-sm-6">
                        <div className="gallery-item">
                            <img src="/images/gallery-img22.jpg" alt="" />
                            <a href="images/gallery-img22.jpg" className="glightbox">
                                <span className="gallery-icon"></span></a>
                        </div>
                    </div>
                    <div className="col-lg-4 col-sm-6">
                        <div className="gallery-item">
                            <img src="/images/gallery-img23.jpg" alt="" />
                            <a href="images/gallery-img23.jpg" className="glightbox">
                                <span className="gallery-icon"></span></a>
                        </div>
                    </div>
                    <div className="col-lg-4 col-sm-6">
                        <div className="gallery-item">
                            <img src="/images/gallery-img24.jpg" alt="" />
                            <a href="images/gallery-img24.jpg" className="glightbox">
                                <span className="gallery-icon"></span></a>
                        </div>
                    </div>
                    <div className="col-lg-4 col-sm-6">
                        <div className="gallery-item">
                            <img src="/images/gallery-img25.jpg" alt="" />
                            <a href="images/gallery-img25.jpg" className="glightbox">
                                <span className="gallery-icon"></span></a>
                        </div>
                    </div>
                    <div className="col-lg-4 col-sm-6">
                        <div className="gallery-item">
                            <img src="/images/gallery-img26.jpg" alt="" />
                            <a href="images/gallery-img26.jpg" className="glightbox">
                                <span className="gallery-icon"></span></a>
                        </div>
                    </div>
                    <div className="col-lg-4 col-sm-6">
                        <div className="gallery-item">
                            <img src="/images/gallery-img28.jpg" alt="" />
                            <a href="images/gallery-img28.jpg" className="glightbox">
                                <span className="gallery-icon"></span></a>
                        </div>
                    </div>
                    <div className="col-lg-4 col-sm-6">
                        <div className="gallery-item">
                            <img src="/images/gallery-img29.jpg" alt="" />
                            <a href="images/gallery-img29.jpg" className="glightbox">
                                <span className="gallery-icon"></span></a>
                        </div>
                    </div>
                    <div className="col-lg-4 col-sm-6">
                        <div className="gallery-item">
                            <img src="/images/gallery-img30.jpg" alt="" />
                            <a href="images/gallery-img30.jpg" className="glightbox">
                                <span className="gallery-icon"></span></a>
                        </div>
                    </div>
                    <div className="col-lg-4 col-sm-6">
                        <div className="gallery-item">
                            <img src="/images/gallery-img31.jpg" alt="" />
                            <a href="images/gallery-img31.jpg" className="glightbox">
                                <span className="gallery-icon"></span></a>
                        </div>
                    </div>
                    <div className="col-lg-4 col-sm-6">
                        <div className="gallery-item">
                            <img src="/images/gallery-img32.jpg" alt="" />
                            <a href="images/gallery-img32.jpg" className="glightbox">
                                <span className="gallery-icon"></span></a>
                        </div>
                    </div>
                    <div className="col-lg-4 col-sm-6">
                        <div className="gallery-item">
                            <img src="/images/gallery-img35.jpg" alt="" />
                            <a href="images/gallery-img35.jpg" className="glightbox">
                                <span className="gallery-icon"></span></a>
                        </div>
                    </div>
                    <div className="col-lg-4 col-sm-6">
                        <div className="gallery-item">
                            <img src="/images/gallery-img36.jpg" alt="" />
                            <a href="images/gallery-img36.jpg" className="glightbox">
                                <span className="gallery-icon"></span></a>
                        </div>
                    </div>
                    <div className="col-lg-4 col-sm-6">
                        <div className="gallery-item">
                            <img src="/images/gallery-img37.jpg" alt="" />
                            <a href="images/gallery-img37.jpg" className="glightbox">
                                <span className="gallery-icon"></span></a>
                        </div>
                    </div>
                    <div className="col-lg-4 col-sm-6">
                        <div className="gallery-item">
                            <img src="/images/gallery-img38.jpg" alt="" />
                            <a href="images/gallery-img38.jpg" className="glightbox">
                                <span className="gallery-icon"></span></a>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Gallery;
