import React from 'react';
import { gala } from '../../config/gala-2026';
import { timeRange } from '../../lib/gala';
import { ShowIn } from './GalaState';
import Countdown from './Countdown';
import Motif from './Motif';
import styles from './Gala.module.css';

const BEFORE = ['coming_soon', 'on_sale', 'online_closed'];

const GalaHero = () => {
    const chips = [
        { icon: 'fa-calendar', text: gala.dateDisplay },
        { icon: 'fa-clock-o', text: timeRange() ?? 'Time to be announced' },
        {
            icon: 'fa-map-marker',
            text: gala.venue.name ? [gala.venue.name, gala.venue.city].filter(Boolean).join(' · ') : 'Venue to be announced',
        },
        { icon: 'fa-diamond', text: gala.dressCode.label },
    ];

    return (
        <section id="top" className={`${styles.section} ${styles.ink} ${styles.hero}`}>
            <div className={`${styles.container} ${styles.heroInner}`}>
                <h1 className={styles.h1}>
                    {gala.name}
                    <span className={styles.year}>{gala.year}</span>
                </h1>
                {gala.tagline && <p className={styles.tagline}>{gala.tagline}</p>}

                <ul className={styles.chips} aria-label="Event details">
                    {chips.map((chip) => (
                        <li key={chip.icon} className={styles.chip}>
                            <i className={`fa ${chip.icon}`} aria-hidden="true"></i>
                            {chip.text}
                        </li>
                    ))}
                </ul>

                <ShowIn states={BEFORE}>
                    <div className={styles.intro}>
                        {gala.copy.intro.map((para) => <p key={para}>{para}</p>)}
                    </div>
                    <div className={styles.ctas}>
                        <a href="#tickets" className={`${styles.btn} ${styles.btnPrimary}`}>Get Tickets</a>
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
