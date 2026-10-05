"use client";

import React from 'react';
import { gala } from '../../config/gala-2026';
import { checkoutMode, EXTERNAL_LINK } from '../../lib/gala';
import { useGalaCheckout } from '../GalaCheckout';

// A way into the ticket checkout, per checkout mode:
//  modal: a button opening the pop-up checkout (GalaCheckout) while it's available
//  embed: a link to the inline embed below the cards (#checkout)
//  link:  the platform's hosted page in a new tab
// Otherwise `fallback` (default: nothing), so there's never a dead button.
const CheckoutCta = ({ className, label, embedLabel = label, fallback = null }) => {
    const { available, open } = useGalaCheckout();
    const mode = checkoutMode();
    if (mode === 'modal') {
        return available ? <button type="button" className={className} onClick={open}>{label}</button> : fallback;
    }
    if (mode === 'embed') return <a href="#checkout" className={className}>{embedLabel}</a>;
    if (mode === 'link') return <a href={gala.checkout.tickets.hostedUrl} className={className} {...EXTERNAL_LINK}>{label}</a>;
    return fallback;
};

export default CheckoutCta;
