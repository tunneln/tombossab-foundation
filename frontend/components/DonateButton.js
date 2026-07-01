import React from 'react';
import { useDonate } from './DonateProvider';

// The "Donate" call-to-action. Every instance triggers the single, shared modal
// (see DonateProvider) rather than owning its own — so all buttons open the same
// persistent form.
//
// The anchor keeps href="/donatenow" so it still works without JS (progressive
// enhancement); the click handler intercepts and opens the modal instead.
//
// `className` controls the look: pass "theme-btn" for a normal button or
// "donate-floating" for the fixed side tab. `donate-btn` is always present as a
// stable hook for styling/tests.
const DonateButton = ({ className = '' }) => {
    const { open } = useDonate();

    return (
        <a
            href="/donatenow"
            className={`donate-btn ${className}`.trim()}
            onClick={(e) => { e.preventDefault(); open(); }}
        >
            <img src="/images/donorbox-logo-white.svg" alt="" /> &nbsp;Donate
        </a>
    );
};

export default DonateButton;
