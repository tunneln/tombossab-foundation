import React from 'react';
import { formatPrice, tierDeductible } from '../../lib/gala';
import Motif from './Motif';
import styles from './Gala.module.css';

// One pricing card, shared by the ticket tiers and the sponsorship levels.
// Order (top to bottom): badge, name, price, lead, availability, includes,
// tagline/note, deductible, seats line, CTA. Every line renders only if its
// data exists, so unconfirmed values simply don't appear.
const TierCard = ({ tier, list, availability, cta }) => {
    const deductible = tierDeductible(tier);
    return (
        <li className={`${styles.tier} ${tier.featured ? styles.tierFeatured : ''} ${styles.reveal}`}>
            {tier.featured && <Motif />}
            {tier.badge && <span className={styles.badge}>{tier.badge}</span>}
            <h3 className={styles.tierName}>{tier.name}</h3>
            <p className={styles.price}>{formatPrice(tier.price)}</p>
            {tier.lead && <p className={styles.tierLead}>{tier.lead}</p>}
            {availability}
            <ul className={styles.includes}>
                {list.map((item) => (
                    <li key={item}><i className="fa fa-check" aria-hidden="true"></i><span>{item}</span></li>
                ))}
            </ul>
            {tier.tagline && <p className={styles.tierTagline}>{tier.tagline}</p>}
            {tier.note && <p className={styles.tierNote}>{tier.note}</p>}
            {deductible != null && <p className={styles.deductible}>Est. tax-deductible: {formatPrice(deductible)}</p>}
            {tier.seatsLine && <p className={styles.seatsLine}>{tier.seatsLine}</p>}
            {cta && <div className={styles.tierCta}>{cta}</div>}
        </li>
    );
};

export default TierCard;
