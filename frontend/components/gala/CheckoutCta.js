import React from 'react';
import { gala } from '../../config/gala-2026';
import { checkoutMode } from '../../lib/gala';

const EXTERNAL = { target: '_blank', rel: 'noopener noreferrer' };

// A link into the ticket checkout: the embed below the cards (#checkout) in
// embed mode, the platform's hosted page in link mode, nothing if checkout
// isn't configured (never a dead button).
const CheckoutCta = ({ className, embedLabel, linkLabel }) => {
    const mode = checkoutMode();
    if (mode === 'embed') return <a href="#checkout" className={className}>{embedLabel}</a>;
    if (mode === 'link') return <a href={gala.checkout.tickets.hostedUrl} className={className} {...EXTERNAL}>{linkLabel}</a>;
    return null;
};

export default CheckoutCta;
