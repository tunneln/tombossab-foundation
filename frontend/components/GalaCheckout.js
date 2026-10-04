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
const GalaCheckoutContext = createContext({ available: false, open: () => {} });

export const GalaCheckoutProvider = ({ children }) => {
    const { state } = useGalaState();
    const [isOpen, setIsOpen] = useState(false);
    const open = useCallback(() => setIsOpen(true), []);
    const close = useCallback(() => setIsOpen(false), []);
    const available = checkoutMode() === 'modal' && state === 'on_sale';

    return (
        <GalaCheckoutContext.Provider value={{ available, open }}>
            {children}
            {available && <GalaCheckoutModal isOpen={isOpen} close={close} />}
        </GalaCheckoutContext.Provider>
    );
};

export const useGalaCheckout = () => useContext(GalaCheckoutContext);

// Zeffy's modal-form protocol (from its embed-form-script): the host posts
// { id: 'zeffy-iframe', open: true } when showing the form, and the form posts
// { id: 'zeffy-iframe', close: true } when its own × is pressed.
const ZEFFY_ID = 'zeffy-iframe';

const GalaCheckoutModal = ({ isOpen, close }) => {
    // Mounted on first open, then kept (hidden) so an in-progress order survives.
    const [everOpened, setEverOpened] = useState(false);
    useEffect(() => { if (isOpen) setEverOpened(true); }, [isOpen]);

    const closeRef = useRef(null);
    const iframeRef = useRef(null);
    useDialog(isOpen && everOpened, close, closeRef, iframeRef);

    const src = gala.checkout.tickets.modalUrl;
    const zeffy = gala.checkout.provider === 'zeffy';

    const announceOpen = useCallback(() => {
        if (!zeffy) return;
        iframeRef.current?.contentWindow?.postMessage({ id: ZEFFY_ID, open: true }, new URL(src).origin);
    }, [zeffy, src]);

    // Re-opening an already loaded form (the first open announces on iframe load).
    useEffect(() => { if (isOpen && everOpened) announceOpen(); }, [isOpen, everOpened, announceOpen]);

    // The form's own × closes the pop-up. Only messages from our iframe count.
    useEffect(() => {
        if (!zeffy) return undefined;
        const onMessage = (e) => {
            if (e.source === iframeRef.current?.contentWindow && e.data?.id === ZEFFY_ID && e.data.close) close();
        };
        window.addEventListener('message', onMessage);
        return () => window.removeEventListener('message', onMessage);
    }, [zeffy, close]);

    if (!everOpened) return null;

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
            {/* Zeffy's form shows its own × only on phones, so this one is visible
                on desktop (outside the form's corner) and, on phones, appears only
                for keyboard focus. */}
            <button ref={closeRef} type="button" className={styles.close} onClick={close} aria-label="Close checkout">
                &times;
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
