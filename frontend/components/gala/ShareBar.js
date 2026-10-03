"use client";

import React, { useEffect, useState } from 'react';
import { useGala } from './GalaState';
import { gala } from '../../config/gala-2026';
import { calendarReady, googleCalendarUrl, icsContent, shareLinks } from '../../lib/gala';
import styles from './Gala.module.css';

const LINKS = shareLinks();
const EXTERNAL = { target: '_blank', rel: 'noopener noreferrer' };

// Share buttons + add-to-calendar. The native share button needs the Web Share
// API, which only exists in the browser, so it appears after mount.
const ShareBar = () => {
    const { state } = useGala();
    const [canShare, setCanShare] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => { setCanShare(typeof navigator.share === 'function'); }, []);

    const nativeShare = async () => {
        try {
            await navigator.share({ title: gala.name, text: LINKS.text, url: LINKS.url });
        } catch { /* dismissed */ }
    };

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(LINKS.url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        } catch { /* clipboard blocked: the link is still visible in the address bar */ }
    };

    // The .ics is built at click time (so DTSTAMP is "now") and downloaded as a file.
    const downloadIcs = () => {
        const blob = new Blob([icsContent(new Date())], { type: 'text/calendar;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'tombossa-b-foundation-gala-2026.ics';
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    };

    const btn = `${styles.btn} ${styles.btnOutline}`;
    return (
        <>
            <div className={styles.shareButtons}>
                <a href={LINKS.whatsapp} className={`${styles.btn} ${styles.whatsapp}`} {...EXTERNAL}>
                    <i className="fa fa-whatsapp" aria-hidden="true"></i> Share on WhatsApp
                </a>
                {canShare && (
                    <button type="button" className={btn} onClick={nativeShare}>
                        <i className="fa fa-share-alt" aria-hidden="true"></i> Share
                    </button>
                )}
                <button type="button" className={btn} onClick={copyLink}>
                    <i className="fa fa-link" aria-hidden="true"></i> Copy link
                </button>
                <a href={LINKS.facebook} className={btn} {...EXTERNAL}>
                    <i className="fa fa-facebook" aria-hidden="true"></i> Facebook
                </a>
                <a href={LINKS.x} className={btn} {...EXTERNAL}>
                    <i className="fa fa-twitter" aria-hidden="true"></i> X
                </a>
                <a href={LINKS.email} className={btn}>
                    <i className="fa fa-envelope" aria-hidden="true"></i> Email
                </a>
            </div>
            <span className={styles.copied} role="status" aria-live="polite">{copied ? 'Copied!' : ''}</span>

            {calendarReady() && state !== 'past' && (
                <div className={styles.calendar}>
                    <a href={googleCalendarUrl()} className={styles.textLink} {...EXTERNAL}>
                        <i className="fa fa-calendar-plus-o" aria-hidden="true"></i>&nbsp; Add to Google Calendar
                    </a>
                    <button type="button" className={`${styles.textLink} ${styles.linkButton}`} onClick={downloadIcs}>
                        <i className="fa fa-calendar" aria-hidden="true"></i>&nbsp; Download for Apple / Outlook (.ics)
                    </button>
                </div>
            )}
        </>
    );
};

export default ShareBar;
