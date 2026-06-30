import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

// Same campaign the /donatenow page embeds. The iframe is only rendered while
// the modal is open (this component returns null when closed), so it makes no
// network request until a visitor actually opens it.
const EMBED_SRC = 'https://donorbox.org/embed/scholarship-fund-73?language=en-us';

const DonateModal = ({ isOpen, onClose }) => {
    // Close on Escape and lock background scroll while the modal is open.
    useEffect(() => {
        if (!isOpen) return;
        const onKey = (e) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', onKey);
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = prevOverflow;
        };
    }, [isOpen, onClose]);

    // Rendering nothing when closed keeps the iframe (and its request) lazy and
    // also makes this safe for the static export — the portal only runs after a
    // client-side open, never during SSR/export.
    if (!isOpen) return null;

    return createPortal(
        <div
            className="donate-modal-overlay"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-label="Donate to Tombossa B Foundation"
        >
            <div className="donate-modal" onClick={(e) => e.stopPropagation()}>
                <button
                    type="button"
                    className="donate-modal-close"
                    onClick={onClose}
                    aria-label="Close donation form"
                >
                    &times;
                </button>
                {/* Inner frame clips the slightly-overwide iframe (see CSS) to trim
                    the embed's white side padding; the outer modal stays overflow:visible
                    so the close button can sit outside on the backdrop. */}
                <div className="donate-modal-frame">
                    <iframe
                        title="Donate to Tombossa B Foundation"
                        className="donate-modal-iframe"
                        src={EMBED_SRC}
                        name="donorbox"
                        allow="payment"
                        frameBorder={0}
                    />
                </div>
            </div>
        </div>,
        document.body
    );
};

export default DonateModal;
