import React from 'react';
import Link from 'next/link';
import styles from './Gala.module.css';

const GalaStory = () => (
    <section id="story" className={`${styles.section} ${styles.ivory}`}>
        <div className={`${styles.container} ${styles.narrow} ${styles.center} ${styles.reveal}`}>
            <span className={styles.eyebrow}>Our Story</span>
            <h2 className={styles.title}>Why We Gather</h2>
            <p className={styles.storyText}>
                Tombossa Negusse fled war in Eritrea as a teenager, earned his degrees in Oklahoma, and built a
                life in Dallas defined by family, enterprise, and generosity. He and his wife, Birkiti, dreamed of
                opening doors for young people in our community. Two years ago, we launched this foundation to
                carry that dream forward. Today, our first scholars are in college, and we&apos;re just getting started.
            </p>
            <Link href="/about" className={styles.textLink}>Read Tombossa&apos;s story</Link>
        </div>
    </section>
);

export default GalaStory;
