import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useDonate } from './DonateProvider';

// Same campaign the /donatenow page embeds.
const EMBED_SRC = 'https://donorbox.org/embed/scholarship-fund-73?language=en-us';

const DonateModal = () => {
    const { isOpen, close } = useDonate();

    // Once opened, the iframe stays mounted (hidden via CSS when closed) instead of
    // unmounting, so the donor's in-progress form state survives closing and
    // reopening — and, because this single modal lives at the app root, across
    // client-side page navigations too.
    const [everOpened, setEverOpened] = useState(false);
    useEffect(() => { if (isOpen) setEverOpened(true); }, [isOpen]);

    const closeRef = useRef(null);
    const iframeRef = useRef(null);

    // While open: lock background scroll, move focus into the dialog, make the rest
    // of the page inert (so keyboard/AT focus can't wander behind the overlay — this
    // is what makes aria-modal honest), and wire Escape + a Tab guard. On close, undo
    // all of it and restore focus to whatever opened the modal.
    useEffect(() => {
        if (!isOpen) return;

        const trigger = document.activeElement;            // remember who opened it
        const appRoot = document.getElementById('__next'); // page root, sibling of the portal
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
    }, [isOpen, close]);

    // Nothing in the DOM until the first open: keeps the embed request lazy and
    // keeps the static export's server-rendered output clean (the portal only runs
    // after a client-side open, never during SSR/export).
    if (!everOpened) return null;

    return createPortal(
        <div
            className={`donate-modal-overlay${isOpen ? ' is-open' : ''}`}
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label="Donate to Tombossa B Foundation"
            aria-hidden={isOpen ? undefined : true}
        >
            <div className="donate-modal-wrap" onClick={(e) => e.stopPropagation()}>
                <div className="donate-modal">
                    <button
                        ref={closeRef}
                        type="button"
                        className="donate-modal-close"
                        onClick={close}
                        aria-label="Close donation form"
                    >
                        &times;
                    </button>
                    {/* Inner frame clips the slightly-overwide iframe (see CSS) to trim
                        the embed's white side padding; the outer modal stays overflow:visible
                        so the close button can sit outside on the backdrop. */}
                    <div className="donate-modal-frame">
                        <iframe
                            ref={iframeRef}
                            title="Donate to Tombossa B Foundation"
                            className="donate-modal-iframe"
                            src={EMBED_SRC}
                            // Unique name (not the default "donorbox") so this persistent
                            // iframe doesn't collide with the home page's donor-wall embed,
                            // which also uses name="donorbox".
                            name="donorbox-modal"
                            allow="payment"
                            frameBorder={0}
                        />
                    </div>
                </div>
                {/* Tax-deductibility notice on the backdrop below the box, mirroring
                    the original Donorbox popup. */}
                <p className="donate-modal-disclaimer">
                    The Tombossa B Foundation is a 501(c)(3) charitable organization and
                    contributions are tax-deductible for income, gift, and estate taxes.
                    Our EIN is 99-4436179.
                </p>
            </div>
        </div>,
        document.body
    );
};

export default DonateModal;
