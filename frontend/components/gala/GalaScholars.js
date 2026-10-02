import React from 'react';
import Link from 'next/link';
import styles from './Gala.module.css';

// Scholar spotlight, fed by the same recipients data as /award-recipients
// (the page loads it via lib/api.js and passes it in).
const GalaScholars = ({ recipients = [] }) => (
    <section id="scholars" className={`${styles.section} ${styles.ivory}`}>
        <div className={styles.container}>
            <div className={`${styles.heading} ${styles.center} ${styles.reveal}`}>
                <h2 className={styles.title}>Your Ticket, Their Future</h2>
                <p className={styles.lead}>Meet the recipients of our East African Youth Scholarship.</p>
            </div>
            <ul className={styles.scholars}>
                {recipients.map((r) => (
                    <li key={r.id} className={`${styles.scholar} ${styles.reveal}`}>
                        <div className={styles.scholarPhoto}>
                            <img src={r.photo} alt={r.photoAlt || r.name} loading="lazy" />
                        </div>
                        <div>
                            <h3 className={styles.scholarName}>{r.name}</h3>
                            <p className={styles.scholarMeta}>{[r.school, r.major].filter(Boolean).join(' · ')}</p>
                            {r.quote && <blockquote className={styles.scholarQuote}>&ldquo;{r.quote}&rdquo;</blockquote>}
                        </div>
                    </li>
                ))}
            </ul>
            <div className={styles.center}>
                <Link href="/award-recipients" className={styles.textLink}>Meet our scholars</Link>
            </div>
        </div>
    </section>
);

export default GalaScholars;
