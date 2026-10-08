"use client";

import React from 'react';
import { gala } from '../../config/gala-2026';
import { checkoutMode, EXTERNAL_LINK, isPlainClick } from '../../lib/gala';
import { useGalaCheckout } from '../GalaCheckout';

// A way into the ticket checkout, per checkout mode:
//  modal: a link that opens the pop-up checkout (GalaCheckout) while it's
//         available. It's a real link to the checkout form, so a tap before the
//         page's scripts load (slow phone) or with JavaScript off still reaches
//         checkout, in a new tab, instead of doing nothing.
//  embed: a link to the inline embed below the cards (#checkout)
//  link:  the platform's hosted page in a new tab
// Otherwise `fallback` (default: nothing), so there's never a dead button.
const CheckoutCta = ({ className, label, embedLabel = label, fallback = null }) => {
    const { available, open } = useGalaCheckout();
    const mode = checkoutMode();
    const { hostedUrl, modalUrl } = gala.checkout.tickets;
    if (mode === 'modal') {
        if (!available) return fallback;
        return (
            <a
                href={hostedUrl || modalUrl}
                className={className}
                {...EXTERNAL_LINK}
                onClick={(e) => {
                    if (!isPlainClick(e)) return;
                    e.preventDefault();
                    open();
                }}
            >
                {label}
            </a>
        );
    }
    if (mode === 'embed') return <a href="#checkout" className={className}>{embedLabel}</a>;
    if (mode === 'link') return <a href={hostedUrl} className={className} {...EXTERNAL_LINK}>{label}</a>;
    return fallback;
};

export default CheckoutCta;
