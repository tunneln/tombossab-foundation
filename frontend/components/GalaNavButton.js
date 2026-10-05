"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useGala } from './gala/GalaState';
import { useGalaCheckout } from './GalaCheckout';
import styles from './GalaNavButton.module.css';

// A plain primary click. Cmd/Ctrl/Shift/Alt-clicks and middle-clicks keep the
// browser's link behavior (new tab/window) instead of opening the pop-up.
const isPlainClick = (e) => e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;

// The side (hamburger) menu is opened/closed by NavOne toggling `active` on this
// container. Following a link to another page closes it (the page re-renders),
// but a same-page jump (#tickets on /gala) would leave it covering the screen.
const closeSideMenu = () => document.querySelector('.side-nav-container')?.classList.remove('active');

// Gold "Gala Tickets" CTA (see NavOne for its placements). Label follows the gala
// state; it disappears after the event.
//  - desktop / floating: open the ticket checkout modal when it's available
//    (embed configured + on sale); otherwise they're plain links.
//  - tablet / menu: always link to /gala.
// On /gala itself, links jump to the ticket section instead of reloading.
// `floating` is the /gala side tab that replaces the Donate tab; outside the
// ticket-selling states it renders `fallback` (the regular Donate tab) instead.
const GalaNavButton = ({ placement, fallback = null }) => {
    const { state } = useGala();
    const { available, open } = useGalaCheckout();
    const pathname = usePathname();

    if (placement === 'floating' && !['coming_soon', 'on_sale'].includes(state)) return fallback;
    if (state === 'past') return null;

    const label = state === 'online_closed' ? 'The Gala' : 'Gala Tickets';
    const className = `${styles.pill} ${styles[placement]}`;
    const href = pathname === '/gala' ? '#tickets' : '/gala';
    const opensModal = available && (placement === 'desktop' || placement === 'floating');

    let button;
    if (opensModal) {
        // Keeps a real href so it still works without JS (progressive enhancement).
        button = (
            <a
                href={href}
                className={className}
                onClick={(e) => {
                    if (!isPlainClick(e)) return;
                    e.preventDefault();
                    open();
                }}
            >
                {placement === 'floating' && <i className="fa fa-ticket" aria-hidden="true"></i>}
                {label}
            </a>
        );
    } else if (href === '#tickets') {
        button = (
            <a href={href} className={className} onClick={placement === 'menu' ? closeSideMenu : undefined}>
                {placement === 'floating' && <i className="fa fa-ticket" aria-hidden="true"></i>}
                {label}
            </a>
        );
    } else {
        button = <Link href={href} className={className}>{label}</Link>;
    }

    // Desktop: a zero-width slot after the Donate button, so the pill sits in
    // the gap beside it without moving any existing header item.
    return placement === 'desktop' ? <span className={styles.desktopSlot}>{button}</span> : button;
};

export default GalaNavButton;
