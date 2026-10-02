import React from 'react';
import { gala } from '../../config/gala-2026';
import { checkoutMode, formatPrice, formatWeekdayDate, providerInfo } from '../../lib/gala';
import { ShowIn } from './GalaState';
import CheckoutCta from './CheckoutCta';
import GalaGoal from './GalaGoal';
import TierCard from './TierCard';
import styles from './Gala.module.css';

const EXTERNAL = { target: '_blank', rel: 'noopener noreferrer' };

const doorLine = () => `Door tickets, if available: ${gala.tiers.attend
    .map((t) => `${t.name} ${formatPrice(t.doorPrice)}`).join(' · ')}.`;

// The checkout itself: the platform's embed (lazy-loaded by the browser as it
// nears the viewport) with a new-tab fallback, or one big link to the hosted page.
const Checkout = () => {
    const { hostedUrl, embedSrc } = gala.checkout.tickets;
    const mode = checkoutMode();
    if (mode === 'embed') {
        return (
            <div id="checkout" className={styles.checkout}>
                <div className={styles.embedFrame} style={{ height: providerInfo()?.embedMinHeight ?? 900 }}>
                    <iframe src={embedSrc} title="Gala ticket checkout" loading="lazy" allow="payment" />
                </div>
                {hostedUrl && (
                    <a href={hostedUrl} className={`${styles.textLink} ${styles.fallbackLink}`} {...EXTERNAL}>
                        Trouble loading checkout? Open it in a new tab →
                    </a>
                )}
            </div>
        );
    }
    if (mode === 'link') {
        return (
            <div id="checkout" className={styles.checkout}>
                <a href={hostedUrl} className={`${styles.btn} ${styles.btnPrimary} ${styles.btnLarge}`} {...EXTERNAL}>
                    Get Your Tickets
                </a>
            </div>
        );
    }
    return null;
};

const GalaTickets = () => (
    <ShowIn states={['coming_soon', 'on_sale', 'online_closed']}>
        <section id="tickets" className={`${styles.section} ${styles.ink}`}>
            <div className={styles.container}>
                <GalaGoal />
                <div className={`${styles.heading} ${styles.center} ${styles.reveal}`}>
                    <span className={styles.eyebrow}>Tickets</span>
                    <h2 className={styles.title}>Attend the Gala</h2>
                    <p className={styles.lead}>
                        Every ticket helps fund scholarships and mental wellness programs for Eritrean and East African youth.
                    </p>
                </div>

                <ul className={styles.tiers}>
                    {gala.tiers.attend.map((tier) => (
                        <TierCard
                            key={tier.id}
                            tier={tier}
                            list={tier.includes}
                            cta={(
                                <ShowIn states={['on_sale']}>
                                    <CheckoutCta
                                        className={`${styles.btn} ${tier.featured ? styles.btnPrimary : styles.btnOutline} ${styles.btnBlock}`}
                                        embedLabel="Select tickets below"
                                        linkLabel="Get Tickets"
                                    />
                                </ShowIn>
                            )}
                        />
                    ))}
                </ul>

                <ul className={styles.notes}>
                    <li>Drink tickets can be redeemed for non-alcoholic drinks. Alcohol served to guests 21+ with valid ID.</li>
                    {gala.sales.onlineCloseAt && (
                        <ShowIn states={['coming_soon', 'on_sale']}>
                            <li>Online sales close {formatWeekdayDate(gala.sales.onlineCloseAt)}.</li>
                        </ShowIn>
                    )}
                    {gala.sales.doorSalesAvailable && <li>{doorLine()}</li>}
                    <li>Tables are available in advance only.</li>
                </ul>

                <ShowIn states={['on_sale']}>
                    <Checkout />
                </ShowIn>

                <ShowIn states={['coming_soon']}>
                    <div className={styles.statusPanel}>
                        <p className={styles.statusTitle}>Tickets go on sale soon.</p>
                        <p className={styles.statusText}>
                            Be the first to know: <a href="#subscribe" className={styles.inlineLink}>subscribe to our newsletter</a>{' '}
                            or email <a href="mailto:contact@tombossabfoundation.org" className={styles.inlineLink}>contact@tombossabfoundation.org</a>.
                        </p>
                    </div>
                </ShowIn>

                <ShowIn states={['online_closed']}>
                    <div className={styles.statusPanel}>
                        <p className={styles.statusTitle}>Online ticket sales have closed.</p>
                        {gala.sales.doorSalesAvailable && <p className={styles.statusText}>{doorLine()}</p>}
                    </div>
                </ShowIn>
            </div>
        </section>
    </ShowIn>
);

export default GalaTickets;
