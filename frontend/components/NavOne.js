"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import DonateButton from "./DonateButton";
import GalaNavButton from "./GalaNavButton";

// `overHero`: the page opens with the nav over a dark full-screen hero (the home
// page), so it starts in its "white" treatment (white logo + white hamburger)
// and keeps it until scrolled. The page says so explicitly rather than the nav
// inferring it from the URL: when Vercel regenerates the home page (ISR) it
// renders it as "/index", so checking the URL for the root path shipped the dark logo,
// and hydration doesn't repair mismatched attributes, so it stayed dark.
const NavOne = ({ overHero = false }) => {
    const pathname = usePathname();
    const [sticky, setSticky] = useState(false);
    const [logoSrc, setLogoSrc] = useState(overHero ? "/images/logo-white.png" : "/images/logo.png");
    const [whiteNav, setWhiteNav] = useState(overHero);
    const [menuOpen, setMenuOpen] = useState(false);

    // White only at the top of a hero page; dark everywhere else and once
    // scrolled. Re-synced (and the listener re-bound) on client-side navigation
    // too, so the nav never keeps the previous page's colors (e.g. a white
    // hamburger from the home hero turning invisible on a light inner page).
    useEffect(() => {
        const syncNav = () => {
            const scrolled = window.scrollY > 100;
            const white = overHero && !scrolled;
            setSticky(scrolled);
            setLogoSrc(white ? "/images/logo-white.png" : "/images/logo.png");
            setWhiteNav(white);
        };
        syncNav();
        window.addEventListener("scroll", syncNav);
        return () => window.removeEventListener("scroll", syncNav);
    }, [overHero, pathname]);

    // The side menu closes on navigation.
    useEffect(() => {
        setMenuOpen(false);
    }, [pathname]);

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
                        <div className="row header-row">
                            <div className="col-lg-5 col-sm-5 site-branding">
                                <div className="logo-action d-flex align-items-center">
                                    <div className="brand-logo">
                                        <Link href="/">
                                            <img id="white-logo" src={logoSrc} alt="Tombossa B Foundation" title="Tombossa B Foundation" />
                                            <img id="black-logo" src="/images/logo.png" alt="Tombossa B Foundation" title="Tombossa B Foundation" />
                                        </Link>
                                    </div>
                                    <div className="header-btn ml-auto">
                                        <DonateButton className="theme-btn" /><GalaNavButton placement="desktop" />
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-7 col-sm-7 primary-nav">
                                <div className="nav-inner">
                                    <div className="nav-content">
                                        <div className="navigation-top">
                                            <nav className="main-navigation">
                                                <ul>
                                                    <li ><Link className={`${sticky ? '' : 'pre-sticky-header'}`} href="/">home</Link></li>
                                                    <li><Link href="/about" className={`${sticky ? '' : 'pre-sticky-header'}`}>about us</Link></li>
                                                    <li> <Link href="/events" className={`${sticky ? '' : 'pre-sticky-header'}`}>events</Link> </li>
                                                    <li>
                                                        <a href="#" className={`${sticky ? '' : 'pre-sticky-header'}`}>scholarship</a>
                                                        <ul className="dropdown-menu-item">
                                                            <li><Link href="/apply">apply now</Link></li>
                                                            <li><Link href="/award-recipients">award recipients</Link></li>
                                                        </ul>
                                                    </li>
                                                    <li><a href="#" className={`${sticky ? '' : 'pre-sticky-header'}`}>get involved</a>
                                                        <ul className="dropdown-menu-item">
                                                            <li><Link href="/volunteer">become a volunteer</Link></li>
                                                            <li><Link href="/contact">contact us</Link></li>
                                                            <li><Link href="/newsletters">newsletters</Link></li>
                                                            <li><Link href="/causes">causes</Link></li>
                                                            <li><Link href="/gallery">gallery</Link></li>
                                                            {/* <li><Link href="/sponsor">sponsors</Link></li> */}
                                                        </ul>
                                                    </li>
                                                </ul>
                                            </nav>
                                        </div>
                                    </div>
                                    <GalaNavButton placement="tablet" />
                                    <div className="mobile-menu-toggle" onClick={() => setMenuOpen(true)}>
                                        <i className={`fa fa-bars fa-2x fa-white ${whiteNav ? 'white-nav-bar' : ''}`} aria-hidden="true"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={`side-nav-container${menuOpen ? ' active' : ''}`}>
                    <div className="humburger-menu">
                        <div className="humburger-menu-lines side-menu-close" onClick={() => setMenuOpen(false)}></div>
                    </div>
                    <div className="side-menu-wrap">
                        <ul className="side-menu-ul">
                            <li className="sidenav__item"><GalaNavButton placement="menu" onNavigate={() => setMenuOpen(false)} /></li>
                            <li className="sidenav__item"><Link href="/">home</Link></li>
                            <li className="sidenav__item"><Link href="/about">about us</Link></li>
                            <li className="sidenav__item"><Link href="/events">events</Link> </li>
                            <li className="sidenav__item"><a href="#">scholarship</a>
                                <ul className="side-sub-menu">
                                    <li className="sidenav__item"><Link href="/apply">apply now</Link></li>
                                    <li className="sidenav__item"><Link href="/award-recipients">award recipients</Link></li>
                                </ul>
                            </li>
                            <li className="sidenav__item"><Link href="#">get involved</Link>
                                <ul className="side-sub-menu">
                                    <li className="sidenav__item"><Link href="/volunteer">become a volunteer</Link></li>
                                    <li className="sidenav__item"><Link href="/contact">contact us</Link></li>
                                    <li className="sidenav__item"><Link href="/newsletters">newsletters</Link></li>
                                    <li className="sidenav__item"><Link href="/causes">causes</Link></li>
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
                            <DonateButton className="theme-btn" />
                        </div>
                    </div>
                </div>
            </header>
            {/* Always-visible fixed donate tab (replaces Donorbox's injected popup button).
                On /gala it becomes a gold "Gala Tickets" tab while tickets are selling. */}
            {pathname === '/gala'
                ? <GalaNavButton placement="floating" fallback={<DonateButton className="donate-floating" />} />
                : <DonateButton className="donate-floating" />}
        </div>
    );
};

export default NavOne;