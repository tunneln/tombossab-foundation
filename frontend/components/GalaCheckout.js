"use client";

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import useDialog from './useDialog';
import useGalaState from './gala/useGalaState';
import { gala } from '../config/gala-2026';
import { checkoutMode, providerInfo } from '../lib/gala';
import styles from './GalaCheckout.module.css';

// App-level pop-up ticket checkout (checkout.tickets.modalUrl), opened by every
// ticket CTA: the desktop header button, the /gala side tab, the tier, sponsor,
// and Sponsor a Seat buttons (see CheckoutCta, GalaNavButton). `available` is
// false until a modal URL is configured and tickets are on sale; the buttons
// then fall back to links, so there's never a dead button.
//
// It does the job of Zeffy's embed script (same "modal" form URL, same
// open/close messages) without that script's limits in a Next.js app: the script
// binds only to buttons present on the first page load (so they'd go dead after
// client-side navigation) and loads the form on every page view. Here the form
// loads on first open and survives closing and navigation (like DonateProvider).
//
// `available` only gates OPENING. Once opened, the pop-up stays mounted while it's
// open even if sales close underneath it (the minute ticker can flip the state
// mid-purchase), so an order in progress or its confirmation never vanishes; it
// unmounts only after it's closed and can't be reopened.
const GalaCheckoutContext = createContext({ available: false, open: () => {} });

export const GalaCheckoutProvider = ({ children }) => {
    const { state } = useGalaState();
    const [isOpen, setIsOpen] = useState(false);
    const [started, setStarted] = useState(false); // first opened: load the form from then on
    const available = checkoutMode() === 'modal' && state === 'on_sale';
    const open = useCallback(() => { setStarted(true); setIsOpen(true); }, []);
    const close = useCallback(() => setIsOpen(false), []);

    return (
        <GalaCheckoutContext.Provider value={{ available, open }}>
            {children}
            {started && (available || isOpen) && <GalaCheckoutModal isOpen={isOpen} close={close} />}
        </GalaCheckoutContext.Provider>
    );
};

export const useGalaCheckout = () => useContext(GalaCheckoutContext);

// Zeffy's modal-form protocol (from its embed-form-script): the host posts
// { id: 'zeffy-iframe', open: true } when showing the form, and the form posts
// { id: 'zeffy-iframe', close: true } when its own × is pressed.
const ZEFFY_ID = 'zeffy-iframe';

// Mounted by the provider on first open (open at mount), then kept, hidden when
// closed, so an in-progress order survives closing and reopening.
const GalaCheckoutModal = ({ isOpen, close }) => {
    const closeRef = useRef(null);
    const iframeRef = useRef(null);
    useDialog(isOpen, close, closeRef, iframeRef);

    const src = gala.checkout.tickets.modalUrl;
    const zeffy = gala.checkout.provider === 'zeffy';

    const announceOpen = useCallback(() => {
        if (!zeffy) return;
        iframeRef.current?.contentWindow?.postMessage({ id: ZEFFY_ID, open: true }, new URL(src).origin);
    }, [zeffy, src]);

    // Re-opening an already loaded form (the first open announces on iframe load).
    useEffect(() => { if (isOpen) announceOpen(); }, [isOpen, announceOpen]);

    // The form's own × closes the pop-up. Only messages from our iframe count.
    useEffect(() => {
        if (!zeffy) return undefined;
        const onMessage = (e) => {
            if (e.source === iframeRef.current?.contentWindow && e.data?.id === ZEFFY_ID && e.data.close) close();
        };
        window.addEventListener('message', onMessage);
        return () => window.removeEventListener('message', onMessage);
    }, [zeffy, close]);

    const provider = providerInfo();
    return createPortal(
        <div
            className={`${styles.overlay} ${isOpen ? styles.open : ''}`}
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label="Gala ticket checkout"
            aria-hidden={isOpen ? undefined : true}
        >
            {/* Always visible, so there's a way out even if the form never loads
                (offline, blocked, Zeffy down). Phones: a "Close" pill in a strip
                above the form, clear of the form's own ×. Desktop (where the form
                has no ×): a round × just outside the form's corner. */}
            <button ref={closeRef} type="button" className={styles.close} onClick={close} aria-label="Close checkout">
                <span className={styles.closeLabel} aria-hidden="true">Close</span>
                <span aria-hidden="true">&times;</span>
            </button>
            <div className={styles.frame} onClick={(e) => e.stopPropagation()}>
                <iframe
                    ref={iframeRef}
                    className={styles.iframe}
                    title={`Gala ticket checkout${provider ? `, powered and secured by ${provider.name}` : ''}`}
                    src={src}
                    allow="payment"
                    onLoad={() => { if (isOpen) announceOpen(); }}
                />
            </div>
        </div>,
        document.body,
    );
};
