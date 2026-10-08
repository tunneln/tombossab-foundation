"use client";

import React, { useEffect, useState } from 'react';
import { useGala } from './GalaState';
import { formatPrice, minTicketPrice } from '../../lib/gala';
import styles from './Gala.module.css';

// Phones only (CSS hides it at >= 768px): a slim "Get Tickets" bar that appears
// once the hero is scrolled away, and steps aside while the ticket section or
// the footer is on screen so it never covers the checkout or footer links.
// Shown only while tickets are on sale.
const StickyCta = () => {
    const { state } = useGala();
    const [inView, setInView] = useState({ hero: true, tickets: false, footer: false });

    useEffect(() => {
        const targets = {
            hero: document.getElementById('top'),
            tickets: document.getElementById('tickets'),
            footer: document.querySelector('.footer-area'),
        };
        const observer = new IntersectionObserver((entries) => {
            setInView((prev) => {
                const next = { ...prev };
                for (const entry of entries) next[entry.target.dataset.stickyKey] = entry.isIntersecting;
                return next;
            });
        });
        for (const [key, el] of Object.entries(targets)) {
            if (!el) continue;
            el.dataset.stickyKey = key;
            observer.observe(el);
        }
        return () => observer.disconnect();
    }, []);

    const visible = state === 'on_sale' && !inView.hero && !inView.tickets && !inView.footer;
    return (
        <div className={`${styles.sticky} ${visible ? styles.stickyVisible : ''}`} aria-hidden={!visible}>
            <a href="#tickets" className={`${styles.btn} ${styles.btnPrimary}`} tabIndex={visible ? 0 : -1}>
                Get Tickets{minTicketPrice() != null && ` — from ${formatPrice(minTicketPrice())}`}
            </a>
        </div>
    );
};

export default StickyCta;
