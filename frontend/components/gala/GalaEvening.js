import React from 'react';
import { gala } from '../../config/gala-2026';
import styles from './Gala.module.css';

const GalaEvening = () => {
    const { dinnerNote, music, schedule, speakers, auctionPreview } = gala.program;
    const tiles = [
        {
            icon: 'fa-cutlery',
            title: 'Dinner',
            text: ['A full dinner to share with our community.', dinnerNote].filter(Boolean).join(' '),
        },
        {
            icon: 'fa-music',
            title: 'Music',
            text: music ? `Music throughout the evening, featuring ${music}.` : 'Music throughout the evening.',
        },
        {
            icon: 'fa-gavel',
            title: 'Silent Auction',
            text: 'Bid on one-of-a-kind items, with proceeds supporting our programs.',
        },
        {
            icon: 'fa-microphone',
            title: 'Speakers',
            text: 'Hear from the scholars and community your support makes possible.',
        },
    ];

    return (
        <section id="evening" className={`${styles.section} ${styles.plum}`}>
            <div className={styles.container}>
                <div className={`${styles.heading} ${styles.center} ${styles.reveal}`}>
                    <span className={styles.eyebrow}>{gala.dateDisplay}</span>
                    <h2 className={styles.title}>The Evening</h2>
                </div>
                <ul className={`${styles.tiles} ${styles.reveal}`}>
                    {tiles.map((tile) => (
                        <li key={tile.title} className={styles.tile}>
                            <span className={styles.tileIcon} aria-hidden="true"><i className={`fa ${tile.icon}`}></i></span>
                            <h3 className={styles.tileTitle}>{tile.title}</h3>
                            <p className={styles.tileText}>{tile.text}</p>
                        </li>
                    ))}
                </ul>

                {schedule.length > 0 && (
                    <div className={styles.subBlock}>
                        <h3 className={styles.subTitle}>Schedule</h3>
                        <ol className={styles.schedule}>
                            {schedule.map((item) => (
                                <li key={`${item.time}-${item.label}`}><time>{item.time}</time><span>{item.label}</span></li>
                            ))}
                        </ol>
                    </div>
                )}

                {speakers.length > 0 && (
                    <div className={styles.subBlock}>
                        <h3 className={styles.subTitle}>Speakers</h3>
                        <ul className={styles.people}>
                            {speakers.map((s) => <li key={s.name}><strong>{s.name}</strong><span>{s.role}</span></li>)}
                        </ul>
                    </div>
                )}

                {auctionPreview.length > 0 && (
                    <div className={styles.subBlock}>
                        <h3 className={styles.subTitle}>Silent Auction Preview</h3>
                        <ul className={styles.auction}>
                            {auctionPreview.map((item) => (
                                <li key={item.title} className={styles.auctionItem}>
                                    {item.image && <img src={item.image} alt={item.title} loading="lazy" />}
                                    <div><h4>{item.title}</h4><p>{item.description}</p></div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </section>
    );
};

export default GalaEvening;
