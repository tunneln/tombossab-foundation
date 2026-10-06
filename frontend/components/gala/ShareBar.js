"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useGala } from './GalaState';
import { gala } from '../../config/gala-2026';
import { calendarReady, EXTERNAL_LINK, googleCalendarUrl, icsContent, shareLinks, STORY_IMAGE } from '../../lib/gala';
import styles from './Gala.module.css';

const LINKS = shareLinks();
const STORY_FILENAME = 'tombossa-b-foundation-gala-2026-story.jpg';

// Websites can't open Instagram's story editor directly, but phones can share an
// image file to Instagram from the system share sheet, which offers "Story". So
// the story button shares a ready-made story image and copies the gala link (for
// Instagram's Link sticker) in the same tap. Where file sharing isn't available
// (e.g. Instagram's in-app browser), phones get a link to the image to save
// instead; computers can't post stories, so there the button downloads it.
const isPhoneOrTablet = () => window.matchMedia('(pointer: coarse)').matches;
const copyForSticker = () =>
    navigator.clipboard?.writeText(LINKS.url).then(() => true, () => false) ?? Promise.resolve(false);
const stickerText = async (copied) => ((await copied)
    ? 'Link copied. In Instagram, add a Link sticker and paste it.'
    : 'In Instagram, add a Link sticker with tombossabfoundation.org/gala.');

const triggerDownload = (href, filename) => {
    const a = document.createElement('a');
    a.href = href;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
};

// Share buttons + add-to-calendar. The native share button needs the Web Share
// API, which only exists in the browser, so it appears after mount.
const ShareBar = () => {
    const { state } = useGala();
    const [canShare, setCanShare] = useState(false);
    const [copied, setCopied] = useState(false);
    const [storyHint, setStoryHint] = useState(null);
    const storyButton = useRef(null);
    const storyLoad = useRef(null);
    const storyFile = useRef(null);
    const selling = state === 'on_sale';

    useEffect(() => { setCanShare(typeof navigator.share === 'function'); }, []);

    // The image must already be in hand when the button is tapped: iOS only
    // opens the share sheet if share() is called within the tap itself, before
    // any waiting. Fetch it once, when the button comes near the screen.
    const loadStoryFile = () => {
        storyLoad.current ??= fetch(STORY_IMAGE)
            .then((res) => (res.ok ? res.blob() : null))
            .then((blob) => {
                storyFile.current = blob && new File([blob], STORY_FILENAME, { type: 'image/jpeg' });
                return storyFile.current;
            })
            .catch(() => null);
        return storyLoad.current;
    };
    useEffect(() => {
        const el = storyButton.current;
        if (!el) return undefined;
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                loadStoryFile();
                observer.disconnect();
            }
        }, { rootMargin: '600px' });
        observer.observe(el);
        return () => observer.disconnect();
    }, [selling]);

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

    const shareStory = async () => {
        if (!isPhoneOrTablet()) {
            triggerDownload(STORY_IMAGE, STORY_FILENAME);
            const copied = await copyForSticker();
            setStoryHint({ text: `Story image downloaded. Send it to your phone, add it to your Instagram story, and add a Link sticker with tombossabfoundation.org/gala.${copied ? ' The link is copied.' : ''}` });
            return;
        }
        const canShareFile = (file) => Boolean(file && navigator.canShare?.({ files: [file] }));
        // share() first, synchronously within the tap; the link copy rides along.
        let shared = canShareFile(storyFile.current) ? navigator.share({ files: [storyFile.current] }) : null;
        const copied = copyForSticker();
        if (!shared) {
            const file = await loadStoryFile(); // only if it hadn't loaded yet (very slow network)
            if (canShareFile(file)) shared = navigator.share({ files: [file] });
        }
        if (shared) {
            // Shown right away: it's what to do inside Instagram.
            setStoryHint({ text: `In the share menu, choose Instagram, then Story. ${await stickerText(copied)}` });
        }
        try {
            if (!shared) throw new Error('file sharing unavailable');
            await shared;
        } catch (err) {
            if (err?.name === 'AbortError') {
                setStoryHint(null); // closed the share menu
                return;
            }
            setStoryHint({ text: `, press and hold it to save it, then add it to your Instagram story. ${await stickerText(copied)}`, imageLink: true });
        }
    };

    // The .ics is built at click time (so DTSTAMP is "now") and downloaded as a file.
    const downloadIcs = () => {
        const blob = new Blob([icsContent(new Date())], { type: 'text/calendar;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        triggerDownload(url, 'tombossa-b-foundation-gala-2026.ics');
        // The download starts asynchronously; revoking right away can cancel it
        // (Safari, some Firefox), so free the blob a little later.
        setTimeout(() => URL.revokeObjectURL(url), 10_000);
    };

    const btn = `${styles.btn} ${styles.btnOutline}`;
    return (
        <>
            <div className={styles.sharePrimary}>
                <a href={LINKS.whatsapp} className={`${styles.btn} ${styles.whatsapp}`} {...EXTERNAL_LINK}>
                    <i className="fa fa-whatsapp" aria-hidden="true"></i> Share on WhatsApp
                </a>
                {/* The story image advertises ticket prices, so only while tickets sell online. */}
                {selling && (
                    <button ref={storyButton} type="button" className={`${styles.btn} ${styles.instagram}`} onClick={shareStory}>
                        <i className="fa fa-instagram" aria-hidden="true"></i> Share to Instagram Story
                    </button>
                )}
            </div>
            <p className={styles.storyHint} role="status" aria-live="polite">
                {storyHint?.imageLink && (
                    <a href={STORY_IMAGE} className={styles.inlineLink} {...EXTERNAL_LINK}>Open the story image</a>
                )}
                {storyHint?.text}
            </p>
            <div className={styles.shareButtons}>
                {canShare && (
                    <button type="button" className={btn} onClick={nativeShare}>
                        <i className="fa fa-share-alt" aria-hidden="true"></i> Share
                    </button>
                )}
                <button type="button" className={btn} onClick={copyLink}>
                    <i className="fa fa-link" aria-hidden="true"></i> Copy link
                </button>
                <a href={LINKS.facebook} className={btn} {...EXTERNAL_LINK}>
                    <i className="fa fa-facebook" aria-hidden="true"></i> Facebook
                </a>
                <a href={LINKS.x} className={btn} {...EXTERNAL_LINK}>
                    <i className="fa fa-twitter" aria-hidden="true"></i> X
                </a>
                <a href={LINKS.email} className={btn}>
                    <i className="fa fa-envelope" aria-hidden="true"></i> Email
                </a>
            </div>
            <span className={styles.copied} role="status" aria-live="polite">{copied ? 'Copied!' : ''}</span>

            {calendarReady() && state !== 'past' && (
                <div className={styles.calendar}>
                    <a href={googleCalendarUrl()} className={styles.textLink} {...EXTERNAL_LINK}>
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
