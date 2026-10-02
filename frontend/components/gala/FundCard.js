"use client";

import React, { useState } from 'react';
import { gala } from '../../config/gala-2026';
import { formatPrice } from '../../lib/gala';
import styles from './Gala.module.css';

// "Give to a Fund": a toggle between the two funds; the Give button opens the
// selected fund's donate link from config. The preset amounts are suggestions
// only: no amount is passed to the platform (we never invent URL parameters).
const FundCard = () => {
    const { funds, presetAmounts, impactLine } = gala.tiers.give;
    const [fundId, setFundId] = useState(funds[0].id);
    const href = gala.checkout.donate[fundId];
    const external = /^https?:/.test(href);

    return (
        <div className={styles.giveCard}>
            <h3 className={styles.tierName}>Give to a Fund</h3>
            <div className={styles.fundToggle} role="group" aria-label="Choose a fund">
                {funds.map((fund) => (
                    <button
                        key={fund.id}
                        type="button"
                        aria-pressed={fund.id === fundId}
                        onClick={() => setFundId(fund.id)}
                    >
                        {fund.name}
                    </button>
                ))}
            </div>
            <p className={styles.amountsLabel}>Suggested gifts</p>
            <ul className={styles.amounts}>
                {presetAmounts.map((amount) => <li key={amount}>{formatPrice(amount)}</li>)}
                <li>Other</li>
            </ul>
            <p className={styles.impact}>{impactLine}</p>
            <div className={styles.tierCta}>
                <a
                    href={href}
                    className={`${styles.btn} ${styles.btnPrimary} ${styles.btnBlock}`}
                    {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
                >
                    Give
                </a>
            </div>
        </div>
    );
};

export default FundCard;
