import React from 'react';
import { gala } from '../../config/gala-2026';
import { BEFORE_EVENT, timeRange } from '../../lib/gala';
import { ShowIn } from './GalaState';
import Countdown from './Countdown';
import Motif from './Motif';
import styles from './Gala.module.css';

const GalaHero = () => {
    // When, where, then the two short details, which pair up side by side on
    // phones (see .chips in the CSS); `wide` chips take a full row there.
    const chips = [
        { icon: 'fa-calendar', text: gala.dateDisplay, wide: true },
        {
            icon: 'fa-map-marker',
            text: gala.venue.name ? [gala.venue.name, gala.venue.city].filter(Boolean).join(' · ') : 'Venue to be announced',
            wide: true,
        },
        { icon: 'fa-clock-o', text: timeRange() ?? 'Time to be announced' },
        { icon: 'fa-diamond', text: gala.dressCode.label },
    ];

    return (
        <section id="top" className={`${styles.section} ${styles.ink} ${styles.hero}`}>
            <div className={`${styles.container} ${styles.heroInner}`}>
                <ShowIn states={['coming_soon', 'on_sale']}>
                    <p className={styles.eyebrow}>{gala.copy.kicker}</p>
                </ShowIn>
                <h1 className={styles.h1}>
                    <span className={styles.titleLead}>{gala.copy.titleLead} </span>
                    {gala.shortName}
                    <span className={styles.year}>{gala.year}</span>
                </h1>
                {gala.tagline && <p className={styles.tagline}>{gala.tagline}</p>}

                <ul className={styles.chips} aria-label="Event details">
                    {chips.map((chip) => (
                        <li key={chip.icon} className={`${styles.chip} ${chip.wide ? styles.chipWide : ''}`}>
                            <i className={`fa ${chip.icon}`} aria-hidden="true"></i>
                            {chip.text}
                        </li>
                    ))}
                </ul>

                <ShowIn states={BEFORE_EVENT}>
                    <div className={styles.intro}>
                        {gala.copy.intro.map((para) => <p key={para}>{para}</p>)}
                    </div>
                    <div className={styles.ctas}>
                        <ShowIn states={['coming_soon', 'on_sale']}>
                            <a href="#tickets" className={`${styles.btn} ${styles.btnPrimary}`}>Get Tickets</a>
                        </ShowIn>
                        {/* Once online sales close, point to the door-ticket info instead. */}
                        {gala.sales.doorSalesAvailable && (
                            <ShowIn states={['online_closed']}>
                                <a href="#tickets" className={`${styles.btn} ${styles.btnPrimary}`}>Tickets at the Door</a>
                            </ShowIn>
                        )}
                        <a href="#sponsor" className={`${styles.btn} ${styles.btnOutline}`}>Become a Sponsor</a>
                    </div>
                    <a href="#give" className={`${styles.textLink} ${styles.giveLink}`}>Can&apos;t make it? Give here</a>
                    <Countdown />
                </ShowIn>

                <ShowIn states={['past']}>
                    <div className={styles.intro}><p>{gala.copy.pastIntro}</p></div>
                    <div className={styles.ctas}>
                        <a href="#give" className={`${styles.btn} ${styles.btnPrimary}`}>Keep the momentum going: Give today</a>
                    </div>
                </ShowIn>
                <ShowIn states={['past']} until={gala.copy.givingTuesday.showUntil}>
                    <p className={styles.notice}>{gala.copy.givingTuesday.line}</p>
                </ShowIn>
            </div>
            <Motif />
        </section>
    );
};

export default GalaHero;
