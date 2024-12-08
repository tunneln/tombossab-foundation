import React, { useState, useEffect } from "react";
import Link from "next/link";

import { useDonorboxScript } from "../hooks/useDonorboxScript";

const NavOne = () => {
    useDonorboxScript();

    const RGBA_CONSTANT = 'rgba(168, 150, 119, 0.11)';
    const [sticky, setSticky] = useState(false);
    const [logoBgColor, setLogoBgColor] = useState('rgba(255, 255, 255, 0)');

    // Scroll handler
    const handleScroll = () => {
        if (window.scrollY > 100) {
            setSticky(true);
            setLogoBgColor('rgba(255, 255, 255, 0)');
        } else {
            setSticky(false);
        }
    };

    // Mobile menu toggle logic
    const mobileMenu = () => {
        const mainNavToggler = document.querySelector(".mobile-menu-toggle");
        const mainNav = document.querySelector(".side-nav-container");
        const closeMenu = document.querySelector(".side-menu-close");

        if (mainNavToggler) {
            mainNavToggler.addEventListener("click", () => {
            mainNav?.classList.add("active");
            });
        }

        if (closeMenu) {
            closeMenu.addEventListener("click", () => {
            mainNav?.classList.remove("active");
            });
        }
    };

    // Setup event listeners on mount
    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        mobileMenu();

        // Cleanup event listeners on unmount
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <div>
            <header className="header-area">
                <div className="header-top-action">
                    <div className="container">
                        <div className="row">
                            <div className="col-sm-8 col-md-8 col-lg-5">
                                <div className="top-action-content">
                                    <div className="info-box info-box-1 d-flex align-items-center">
                                        <ul className="d-flex align-items-center">
                                            <li><a href="mailto:contact@tombossabfoundation.org"><i
                                                className="fa fa-envelope"></i>contact@tombossabfoundation.org</a></li>
                                            <li className="phone-header"><a href="tel:2142083936"><i className="fa fa-phone-square"></i>214 208 3936</a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-4 col-md-4 col-lg-6">
                                <div className="top-action-content info-action-content">
                                    <div className="info-box info-box-2 d-flex align-items-center justify-content-end">
                                        <ul className="top-action-list d-flex align-items-center">
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
                </div>
                <div className={`header-top header-menu-action ${sticky ? 'header-fixed' : 'header-semi-fixed'}`}>
                    <div className="container">
                        <div className="row ostion-top-wrap">
                            <div className="col-lg-5 col-sm-5 site-branding">
                                <div className="logo-action d-flex align-items-center">
                                    <div className="ostion-logo">
                                        <Link href="/">
                                                <img src="/images/logo.png" alt="Tombossa B Foundation" title="Tombossa B Foundation" 
                                                    style={{'backgroundColor': logoBgColor}} />
                                        </Link>
                                    </div>
                                    <div className="header-btn ml-auto">
                                        <Link href="/donatenow" className="theme-btn custom-dbox-popup" data-reminder-widget-enabled="true">
                                            <img src="https://donorbox.org/images/white_logo.svg"/> &nbsp;Donate
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-7 col-sm-7 ostion-menu">
                                <div className="ostion-menu-innner">
                                    <div className="ostion-menu-content">
                                        <div className="navigation-top">
                                            <nav className="main-navigation">
                                                <ul>
                                                    <li ><Link className={`${sticky ? '' : 'pre-sticky-header'}`} href="/">home</Link></li>
                                                    <li><Link href="/about" className={`${sticky ? '' : 'pre-sticky-header'}`}>about us</Link></li>
                                                    <li> <Link href="/causes" className={`${sticky ? '' : 'pre-sticky-header'}`}>causes</Link> </li>
                                                    <li><Link href="/contact" className={`${sticky ? '' : 'pre-sticky-header'}`}>contact</Link></li>
                                                    <li><a href="#" className={`${sticky ? '' : 'pre-sticky-header'}`}>get involved</a>
                                                        <ul className="dropdown-menu-item">
                                                            <li><Link href="/volunteer">become a volunteer</Link></li>
                                                            <li><Link href="/events">events</Link></li>
                                                            <li><Link href="/news">news</Link></li>
                                                            <li><Link href="/gallery">gallery</Link></li>
                                                            {/* <li><Link href="/sponsor">sponsors</Link></li> */}
                                                        </ul>
                                                    </li>
                                                </ul>
                                            </nav>
                                        </div>
                                    </div>
                                    <div className="mobile-menu-toggle">
                                        <i className="fa fa-bars fa-2x"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="side-nav-container">
                    <div className="humburger-menu">
                        <div className="humburger-menu-lines side-menu-close"></div>
                    </div>
                    <div className="side-menu-wrap">
                        <ul className="side-menu-ul">
                            <li className="sidenav__item"><Link href="/">home</Link></li>
                            <li className="sidenav__item"><Link href="/about">about us</Link></li>
                            <li className="sidenav__item"><Link href="/causes">causes</Link> </li>
                            <li className="sidenav__item"><Link href="/contact">contact</Link></li>
                            <li className="sidenav__item"><Link href="#">get involved</Link>
                                <ul className="side-sub-menu">
                                    <li className="sidenav__item"><Link href="/volunteer">become a volunteer</Link></li>
                                    <li className="sidenav__item"><Link href="/events">events</Link></li>
                                    <li className="sidenav__item"><Link href="/news">news</Link></li>
                                    <li className="sidenav__item"><Link href="/gallery">gallery</Link></li>
                                    {/* <li className="sidenav__item"><Link href="/sponsor">sponsors</Link></li> */}
                                </ul>
                            </li>
                        </ul>
                        <ul className="side-social">
                            <li><a rel="noopener noreferrer" target="_blank" href="https://x.com/TombossaBFound"><i className="fa fa-twitter"></i></a></li>
                            <li><a rel="noopener noreferrer" target="_blank" href="https://www.facebook.com/share/g/14WErFWRzR/"><i className="fa fa-facebook"></i></a></li>
                            <li><a rel="noopener noreferrer" target="_blank" href="https://www.instagram.com/tombossabfoundation"><i className="fa fa-instagram"></i></a></li>
                            <li><a rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/@TombossaBFoundation"><i className="fa fa-youtube-play"></i></a></li>
                        </ul>
                        <div className="side-btn">
                            <Link href="/donatenow" className="theme-btn custom-dbox-popup" data-reminder-widget-enabled="true">
                                <img src="https://donorbox.org/images/white_logo.svg"/> &nbsp;Donate
                            </Link>
                        </div>
                    </div>
                </div>
            </header>
        </div>
    );
};

export default NavOne;