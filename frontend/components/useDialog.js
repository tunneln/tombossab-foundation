"use client";

import { useEffect } from 'react';

// Shared behavior for the app-level iframe modals (DonateModal, GalaCheckoutModal).
// While open: lock background scroll, move focus into the dialog, make the rest
// of the page inert (so keyboard/AT focus can't wander behind the overlay — this
// is what makes aria-modal honest), and wire Escape + a Tab guard. On close, undo
// all of it and restore focus to whatever opened the modal.
const useDialog = (isOpen, close, closeRef, iframeRef) => {
    useEffect(() => {
        if (!isOpen) return;

        const trigger = document.activeElement;               // remember who opened it
        const appRoot = document.getElementById('app-root');  // page content, outside the portal
        appRoot?.setAttribute('inert', '');

        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        closeRef.current?.focus();                          // start keyboard/SR users inside the dialog

        const onKey = (e) => {
            if (e.key === 'Escape') { close(); return; }
            // Minimal focus trap: with the background inert, the only tab stops are the
            // close button and the embed iframe — keep Tab cycling between them. (Once
            // focus is INSIDE the cross-origin iframe its keydowns don't reach us, a hard
            // browser boundary, but the inert background still can't be tabbed into.)
            if (e.key !== 'Tab') return;
            const first = closeRef.current;
            const last = iframeRef.current;
            if (!first || !last) return;
            if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
            else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        };
        document.addEventListener('keydown', onKey);

        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = prevOverflow;
            appRoot?.removeAttribute('inert');
            if (trigger instanceof HTMLElement) trigger.focus(); // restore focus to the opener
        };
    }, [isOpen, close, closeRef, iframeRef]);
};

export default useDialog;
