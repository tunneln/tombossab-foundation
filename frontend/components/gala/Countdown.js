"use client";

import React from 'react';
import { useGala, useGalaNow } from './GalaState';
import { countdownLabel, daysUntil } from '../../lib/gala';
import styles from './Gala.module.css';

// "57 days to go". Client-only (renders nothing until the date is known) and
// only while tickets are on sale or about to be at the door.
const Countdown = () => {
    const { state } = useGala();
    const now = useGalaNow();
    if (!now || !['on_sale', 'online_closed'].includes(state)) return null;
    const label = countdownLabel(daysUntil(now));
    return label ? <p className={styles.countdown}>{label}</p> : null;
};

export default Countdown;
