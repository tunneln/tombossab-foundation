"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import useGalaState from './gala/useGalaState';
import styles from './GalaNavButton.module.css';

// Gold "Gala Tickets" pill in the site header (see NavOne for its three
// placements). Label follows the gala state; it disappears after the event.
// On /gala itself it jumps to the ticket section instead of reloading the page.
const GalaNavButton = ({ placement }) => {
    const { state } = useGalaState();
    const pathname = usePathname();
    if (state === 'past') return null;

    const label = state === 'online_closed' ? 'The Gala' : 'Gala Tickets';
    const className = `${styles.pill} ${styles[placement]}`;
    const button = pathname === '/gala'
        ? <a href="#tickets" className={className}>{label}</a>
        : <Link href="/gala" className={className}>{label}</Link>;

    // Desktop: a zero-width slot after the Donate button, so the pill sits in
    // the gap beside it without moving any existing header item.
    return placement === 'desktop' ? <span className={styles.desktopSlot}>{button}</span> : button;
};

export default GalaNavButton;
