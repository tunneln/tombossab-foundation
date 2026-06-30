import React, { useState } from 'react';
import DonateModal from './DonateModal';

// Single source of truth for the "Donate" call-to-action. Opens an in-page modal
// on every viewport (replacing Donorbox's widget.js popup, which only rendered a
// modal on desktop and fell back to opening /donatenow in a new tab on mobile).
//
// The anchor keeps href="/donatenow" so it still works without JS (progressive
// enhancement); the click handler intercepts and opens the modal instead.
//
// `className` controls the look: pass "theme-btn" for a normal button or
// "donate-floating" for the fixed side tab. `donate-btn` is always present as a
// stable hook for styling/tests.
const DonateButton = ({ className = '', label = 'Donate', showLogo = true }) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <a
                href="/donatenow"
                className={`donate-btn ${className}`.trim()}
                onClick={(e) => { e.preventDefault(); setOpen(true); }}
            >
                {showLogo && <img src="/images/donorbox-logo-white.svg" alt="" />} &nbsp;{label}
            </a>
            <DonateModal isOpen={open} onClose={() => setOpen(false)} />
        </>
    );
};

export default DonateButton;
