"use client";

import { useLayoutEffect } from 'react';
import styles from './Gala.module.css';

// Subtle fade/rise as sections scroll in. Runs before first paint: elements
// already on screen are shown, the rest are marked "pending" (hidden by CSS)
// and revealed as they enter the viewport.
//
// Fail-safe by design, since hidden content is far worse than no animation:
//  - nothing is hidden with reduced motion, without IntersectionObserver, or
//    when the page opens at an anchor (e.g. /gala#sponsor from the homepage
//    slide): the browser jumps straight there, past content that would
//    otherwise wait for a scroll that never comes;
//  - every run re-derives each element's state (a remount can't strand an
//    element marked by an earlier run);
//  - cleanup reveals everything still pending.
const RevealOnScroll = () => {
    useLayoutEffect(() => {
        const elements = [...document.querySelectorAll(`.${styles.reveal}`)];
        const reveal = (el) => el.removeAttribute('data-reveal');

        const skip = window.matchMedia('(prefers-reduced-motion: reduce)').matches
            || !('IntersectionObserver' in window)
            || window.location.hash;
        if (skip) {
            elements.forEach(reveal);
            return undefined;
        }

        const observer = new IntersectionObserver((entries) => {
            for (const entry of entries) {
                if (!entry.isIntersecting) continue;
                reveal(entry.target);
                observer.unobserve(entry.target);
            }
        }, { rootMargin: '0px 0px -8% 0px' });

        for (const el of elements) {
            if (el.getBoundingClientRect().top < window.innerHeight) {
                reveal(el);
                continue;
            }
            el.setAttribute('data-reveal', 'pending');
            observer.observe(el);
        }

        return () => {
            observer.disconnect();
            elements.forEach(reveal);
        };
    }, []);

    return null;
};

export default RevealOnScroll;
