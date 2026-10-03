"use client";

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import useDialog from './useDialog';
import useGalaState from './gala/useGalaState';
import { gala } from '../config/gala-2026';
import { checkoutMode, providerInfo } from '../lib/gala';
import styles from './GalaCheckout.module.css';

// App-level gala ticket checkout modal, opened by the desktop header "Gala
// Tickets" button and the /gala side tab (see GalaNavButton). It embeds the
// platform's ticket form (checkout.tickets.embedSrc, Zeffy or Donorbox per
// checkout.provider). `available` is false until an embed URL is configured and
// tickets are on sale; the buttons then fall back to plain links, so there's
// never a dead button. Like DonateProvider, it lives at the app root so the form
// survives closing, reopening, and client-side navigation.
const GalaCheckoutContext = createContext({ available: false, open: () => {} });

export const GalaCheckoutProvider = ({ children }) => {
    const { state } = useGalaState();
    const [isOpen, setIsOpen] = useState(false);
    const open = useCallback(() => setIsOpen(true), []);
    const close = useCallback(() => setIsOpen(false), []);
    const available = checkoutMode() === 'embed' && state === 'on_sale';

    return (
        <GalaCheckoutContext.Provider value={{ available, open }}>
            {children}
            {available && <GalaCheckoutModal isOpen={isOpen} close={close} />}
        </GalaCheckoutContext.Provider>
    );
};

export const useGalaCheckout = () => useContext(GalaCheckoutContext);

const GalaCheckoutModal = ({ isOpen, close }) => {
    // Mounted on first open, then kept (hidden) so an in-progress order survives.
    const [everOpened, setEverOpened] = useState(false);
    useEffect(() => { if (isOpen) setEverOpened(true); }, [isOpen]);

    const closeRef = useRef(null);
    const iframeRef = useRef(null);
    // isOpen && everOpened: run once the dialog is actually mounted (first open), so focus can move into it.
    useDialog(isOpen && everOpened, close, closeRef, iframeRef);

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
            <div className={styles.wrap} onClick={(e) => e.stopPropagation()}>
                <div className={styles.box}>
                    <button ref={closeRef} type="button" className={styles.close} onClick={close} aria-label="Close ticket checkout">
                        &times;
                    </button>
                    <iframe
                        ref={iframeRef}
                        className={styles.iframe}
                        title="Gala ticket checkout"
                        src={gala.checkout.tickets.embedSrc}
                        allow="payment"
                    />
                </div>
                <p className={styles.caption}>
                    {gala.name} · {gala.dateDisplay}
                    {provider && <> · Secure checkout by {provider.name}</>}
                </p>
            </div>
        </div>,
        document.body,
    );
};
