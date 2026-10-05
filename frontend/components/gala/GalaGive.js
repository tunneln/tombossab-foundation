import React from 'react';
import { gala } from '../../config/gala-2026';
import { BEFORE_EVENT, formatPrice, tierDeductible } from '../../lib/gala';
import { ShowIn } from './GalaState';
import CheckoutCta from './CheckoutCta';
import FundCard from './FundCard';
import styles from './Gala.module.css';

const GalaGive = () => {
    const { sponsorSeat, programListing } = gala.tiers.give;
    return (
        <section id="give" className={`${styles.section} ${styles.ivory}`}>
            <div className={styles.container}>
                <div className={`${styles.heading} ${styles.center} ${styles.reveal}`}>
                    <h2 className={styles.title}>Can&apos;t Make It? You Can Still Be There.</h2>
                </div>
                <div className={`${styles.giveGrid} ${styles.reveal}`}>
                    {/* Sponsor a Seat is a ticket type on the platform, so it lives
                        and dies with ticket sales. */}
                    <ShowIn states={['coming_soon', 'on_sale']}>
                        <div className={styles.giveCard}>
                            <h3 className={styles.tierName}>{sponsorSeat.name}</h3>
                            <p className={styles.price}>{formatPrice(sponsorSeat.price)}</p>
                            <p className={styles.giveText}>{sponsorSeat.description}</p>
                            {tierDeductible(sponsorSeat) === sponsorSeat.price && (
                                <p className={styles.deductible}>Fully tax-deductible</p>
                            )}
                            <ShowIn states={['on_sale']}>
                                <div className={styles.tierCta}>
                                    <CheckoutCta
                                        className={`${styles.btn} ${styles.btnPrimary} ${styles.btnBlock}`}
                                        label="Sponsor a Seat"
                                    />
                                </div>
                            </ShowIn>
                            <ShowIn states={['coming_soon']}>
                                <p className={styles.tierNote}>Available when tickets go on sale.</p>
                            </ShowIn>
                        </div>
                    </ShowIn>
                    <FundCard />
                </div>
                <ShowIn states={BEFORE_EVENT}>
                    <p className={styles.giveNote}>
                        Gifts of {formatPrice(programListing.threshold)} or more are listed as Friends of the Foundation in the gala program.
                        {programListing.deadline && ` Give by ${programListing.deadline} to be included.`}
                    </p>
                </ShowIn>
            </div>
        </section>
    );
};

export default GalaGive;
