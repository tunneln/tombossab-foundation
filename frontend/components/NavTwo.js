import React, {Component} from 'react';
import Link from 'next/link';

class NavTwo extends Component {
    constructor(){
        super()
        this.state = {
          sticky: false
        };
    }

    componentDidMount(){
        window.addEventListener('scroll', this.handleScroll);

        //Mobile Menu
        this.mobileMenu();
    }

    handleScroll = () => {

      if (window.scrollY > 100) {
        this.setState({
            sticky: true
        });
      } else if (window.scrollY < 100) {
        this.setState({
            sticky: false
        });
      }

    }

    mobileMenu = () => {
        //Mobile Menu Toggle
        let mainNavToggler = document.querySelector(".mobile-menu-toggle");
        let mainNav = document.querySelector(".side-nav-container");

        mainNavToggler.addEventListener("click", function () {
            mainNav.classList.add('active');
        });

        //Close Mobile Menu
        let closeMenu = document.querySelector(".side-menu-close");
            closeMenu.addEventListener("click", function () {
            mainNav.classList.remove('active');
        });

    }

    render() {
        return (
            <div>
                <header className="header-area">
                    <div className="header-top-action">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-5">
                                    <div className="top-action-content">
                                        <div className="info-box info-box-1 d-flex align-items-center">
                                            <ul className="d-flex align-items-center">
                                                <li><a href="mailto:contact@tombossabfoundation.org"><i
                                                    className="fa fa-envelope"></i>contact@tombossabfoundation.org</a></li>
                                                <li><a href="tel:2142083936"><i className="fa fa-phone-square"></i>214 208 3936</a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-7">
                                    <div className="top-action-content info-action-content">
                                        <div className="info-box info-box-2 d-flex align-items-center justify-content-end">
                                            <ul className="top-action-list d-flex align-items-center">
                                                <li><a href="https://x.com/TombossaBFound"><i className="fa fa-twitter"></i></a></li>
                                                <li><a href="https://www.facebook.com/share/g/14WErFWRzR/"><i className="fa fa-facebook"></i></a></li>
                                                <li><a href="https://www.instagram.com/tombossabfoundation"><i className="fa fa-instagram"></i></a></li>
                                                <li><a href="https://www.youtube.com/channel/UCk9Ct2P7rT32HovvbzwqQPw"><i className="fa fa-youtube-play"></i></a></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={`header-top header-menu-action ${this.state.sticky ? 'header-fixed' : ''}`}>
                        <div className="container">
                            <div className="row ostion-top-wrap">
                                <div className="col-lg-5 col-sm-5 site-branding">
                                    <div className="logo-action d-flex align-items-center">
                                        <div className="ostion-logo">
                                            <Link href="/">
                                                    <img src="/images/logo.png" alt="Tombossa B Foundation" title="Tombossa B Foundation" />
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
                                                        <li className="active"><Link href="/">Home</Link></li>
                                                        <li>
                                                            <Link href="/causes">causes</Link>
                                                            <ul className="dropdown-menu-item">
                                                                <li><Link href="/causes">causes</Link></li>
                                                            </ul>
                                                        </li>
                                                        <li><Link href="/events">events</Link></li>
                                                        <li><Link href="/news">news</Link></li>
                                                        <li><a href="#">pages</a>
                                                            <ul className="dropdown-menu-item">
                                                                <li><Link href="/about">about us</Link></li>
                                                                <li><Link href="/gallery">gallery</Link></li>
                                                                <li><Link href="/volunteer">become a volunteer</Link></li>
                                                                <li><Link href="/team">our team</Link></li>
                                                                <li><Link href="/sponsor">sponsors</Link></li>
                                                            </ul>
                                                        </li>
                                                        <li><Link href="/contact">contact</Link></li>
                                                    </ul>
                                                </nav>
                                            </div>
                                        </div>
                                        <div className="mobile-menu-toggle">
                                            <i className="fa fa-bars"></i>
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
                                <li className="sidenav__item"><Link href="/">home</Link>
                                    <span className="menu-plus-icon"></span>
                                </li>
                                <li className="sidenav__item"><a href="#">causes</a>
                                    <span className="menu-plus-icon"></span>
                                    <ul className="side-sub-menu">
                                        <li><Link href="/causes">causes</Link></li>
                                        <li><Link href="#">causes detail</Link></li>
                                    </ul>
                                </li>
                                <li className="sidenav__item"><a href="#">event</a>
                                    <span className="menu-plus-icon"></span>
                                    <ul className="side-sub-menu">
                                        <li><Link href="/events">events</Link></li>
                                        <li><Link href="/events-detail">events detail</Link></li>
                                    </ul>
                                </li>
                                <li className="sidenav__item"><a href="#">news</a>
                                    <span className="menu-plus-icon"></span>
                                    <ul className="side-sub-menu">
                                        <li><Link href="/news">news</Link></li>
                                        <li><Link href="/single-news">news detail</Link></li>
                                    </ul>
                                </li>
                                <li className="sidenav__item"><a href="#">pages</a>
                                    <span className="menu-plus-icon"></span>
                                    <ul className="side-sub-menu">
                                        <li><Link href="/about">about</Link></li>
                                        <li><Link href="/gallery">gallery</Link></li>
                                        <li><Link href="/volunteer">become a volunteer</Link></li>
                                        <li><Link href="/team">our team</Link></li>
                                        <li><Link href="/sponsor">sponsors</Link></li>
                                    </ul>
                                </li>
                                <li className="sidenav__item"><Link href="/contact">contact</Link></li>
                            </ul>
                            <ul className="side-social">
                                <li><a href="https://www.facebook.com/share/g/14WErFWRzR/"><i className="fa fa-facebook"></i></a></li>
                                <li><a href="https://x.com/TombossaBFound"><i className="fa fa-twitter"></i></a></li>
                                <li><a href="https://www.youtube.com/channel/UCk9Ct2P7rT32HovvbzwqQPw"><i className="fa fa-youtube-play"></i></a></li>
                                <li><a href="#"><i className="fa fa-google-plus"></i></a></li>
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
    }
}

export default NavTwo;