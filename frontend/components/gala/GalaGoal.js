import React from 'react';
import { gala } from '../../config/gala-2026';
import { formatPrice, goalIsSet } from '../../lib/gala';
import styles from './Gala.module.css';

// Fundraising progress. Hidden unless both the headline and the goal are set:
// no fake numbers, ever.
const GalaGoal = () => {
    if (!goalIsSet()) return null;
    const { headline, amountGoal, amountRaised } = gala.goal;
    const pct = Math.min(100, Math.round((amountRaised / amountGoal) * 100));
    return (
        <div id="goal" className={styles.goal}>
            <p className={styles.goalHeadline}>{headline}</p>
            <div className={styles.goalBar} role="progressbar" aria-valuemin={0} aria-valuemax={amountGoal}
                aria-valuenow={amountRaised} aria-label="Raised so far">
                <div className={styles.goalFill} style={{ width: `${pct}%` }} />
            </div>
            <p className={styles.goalText}>{formatPrice(amountRaised)} raised of {formatPrice(amountGoal)}</p>
        </div>
    );
};

export default GalaGoal;
