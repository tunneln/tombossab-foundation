"use client";

import { useLayoutEffect } from 'react';
import styles from './Gala.module.css';

// Subtle fade/rise as sections scroll in. Runs before first paint: elements
// already on screen are left alone, the rest are marked "pending" (hidden by
// CSS) and revealed as they enter the viewport. Without JS, or with reduced
// motion, nothing is ever hidden.
const RevealOnScroll = () => {
    useLayoutEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
        if (!('IntersectionObserver' in window)) return undefined;

        const observer = new IntersectionObserver((entries) => {
            for (const entry of entries) {
                if (!entry.isIntersecting) continue;
                entry.target.removeAttribute('data-reveal');
                observer.unobserve(entry.target);
            }
        }, { rootMargin: '0px 0px -8% 0px' });

        for (const el of document.querySelectorAll(`.${styles.reveal}`)) {
            if (el.getBoundingClientRect().top < window.innerHeight) continue;
            el.setAttribute('data-reveal', 'pending');
            observer.observe(el);
        }
        return () => observer.disconnect();
    }, []);

    return null;
};

export default RevealOnScroll;
