"use client";

import React, { useState } from 'react';
import Script from 'next/script';
import { gala } from '../../config/gala-2026';
import styles from './Gala.module.css';

const ZEFFY_EMBED_SCRIPT = 'https://www.zeffy.com/embed/v2/zeffy-embed.js';

// "Give to the Scholarship Fund": Zeffy's embedded donation form
// (checkout.donationForm), via Zeffy's v2 embed script, which fills the
// [data-zeffy-embed] placeholder and resizes the form as donors move through it.
// The script loads only on this card (not site-wide); its init() re-scans each
// time the card mounts, so arriving at /gala by client-side navigation works too
// (it skips placeholders it has already filled). If the script can't load, the
// plain iframe from Zeffy's embed code is shown instead.
const FundCard = () => {
    const { formUrl, fallbackSrc } = gala.checkout.donationForm;
    const [failed, setFailed] = useState(false);

    return (
        <div className={styles.giveCard}>
            <h3 className={styles.tierName}>Give to the Scholarship Fund</h3>
            <p className={styles.impact}>{gala.tiers.give.impactLine}</p>
            <div className={styles.donationForm}>
                {failed
                    ? <iframe className={styles.donationFallback} title="Donation form powered by Zeffy" src={fallbackSrc} allow="payment" />
                    : <div data-zeffy-embed="" data-form-url={formUrl} />}
            </div>
            <Script
                src={ZEFFY_EMBED_SCRIPT}
                strategy="lazyOnload"
                onReady={() => window.Zeffy?.embed?.init()}
                onError={() => setFailed(true)}
            />
        </div>
    );
};

export default FundCard;
