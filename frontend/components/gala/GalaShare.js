import React from 'react';
import { BEFORE_EVENT } from '../../lib/gala';
import { ShowIn } from './GalaState';
import ShareBar from './ShareBar';
import styles from './Gala.module.css';

const GalaShare = () => (
    <section id="share" className={`${styles.section} ${styles.ink}`}>
        <div className={`${styles.container} ${styles.center} ${styles.reveal}`}>
            <h2 className={styles.title}>Share the Night</h2>
            <p className={styles.lead}>The more people in the room, the more students we can support.</p>
            <ShareBar />
            <ShowIn states={BEFORE_EVENT}>
                <div className={styles.finalCta}>
                    <a href="#tickets" className={`${styles.btn} ${styles.btnPrimary} ${styles.btnLarge}`}>Get Tickets</a>
                </div>
            </ShowIn>
        </div>
    </section>
);

export default GalaShare;
