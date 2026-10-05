import React from 'react';
import { gala } from '../../config/gala-2026';
import { BEFORE_EVENT, checkoutMode, CONTACT_EMAIL, EXTERNAL_LINK, sponsorshipHref, tierAvailability } from '../../lib/gala';
import { ShowIn } from './GalaState';
import CheckoutCta from './CheckoutCta';
import TierCard from './TierCard';
import styles from './Gala.module.css';

const SponsorCta = ({ soldOut }) => {
    const cls = `${styles.btn} ${styles.btnBlock}`;
    if (soldOut) return <span className={`${cls} ${styles.btnDisabled}`} aria-disabled="true">Sold out</span>;
    const href = sponsorshipHref();
    const external = /^https?:/.test(href);
    const link = (
        <a href={href} className={`${cls} ${styles.btnPrimary}`} {...(external && EXTERNAL_LINK)}>
            Become a Sponsor
        </a>
    );
    // Sponsorships are ticket types in the same checkout form: with the pop-up
    // checkout (and no dedicated sponsorship link), open it; the link is the
    // fallback when it isn't available.
    if (!gala.checkout.sponsorship.hostedUrl && checkoutMode() === 'modal') {
        return <CheckoutCta className={`${cls} ${styles.btnPrimary}`} label="Become a Sponsor" fallback={link} />;
    }
    return link;
};

// Sponsor wall, by level. Only once there are sponsors to thank.
const SponsorWall = () => {
    const { sponsors } = gala.sponsorship;
    if (sponsors.length === 0) return null;
    return (
        <div className={`${styles.wall} ${styles.center}`}>
            <h2 className={styles.title}>Thank You to Our Sponsors</h2>
            {gala.tiers.sponsor.map((level) => {
                const atLevel = sponsors.filter((s) => s.level === level.id);
                if (atLevel.length === 0) return null;
                return (
                    <div key={level.id} className={styles.wallLevel}>
                        <h3 className={styles.subTitle}>{level.name}s</h3>
                        <ul className={styles.wallLogos}>
                            {atLevel.map((s) => {
                                const content = s.logo ? <img src={s.logo} alt={s.name} /> : s.name;
                                return (
                                    <li key={s.name}>
                                        {s.url
                                            ? <a href={s.url} {...EXTERNAL_LINK}>{content}</a>
                                            : <span>{content}</span>}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                );
            })}
        </div>
    );
};

const SponsorLevels = () => {
    const { packetPdf, logoDeadline } = gala.sponsorship;
    return (
        <>
            <div className={`${styles.heading} ${styles.center} ${styles.reveal}`}>
                <span className={styles.eyebrow}>Sponsorship</span>
                <h2 className={styles.title}>Become a Gala Sponsor</h2>
                <p className={styles.lead}>
                    For businesses, organizations, and families who want to stand behind our scholars publicly.
                </p>
            </div>
            <ul className={styles.sponsorCards}>
                {gala.tiers.sponsor.map((tier) => {
                    const avail = tierAvailability(tier);
                    return (
                        <TierCard
                            key={tier.id}
                            tier={tier}
                            list={tier.benefits}
                            availability={avail && (avail.soldOut
                                ? <p className={styles.availability}>Sold out</p>
                                : (tier.claimed ?? 0) > 0 && <p className={styles.availability}>{avail.remaining} of {tier.limit} remaining</p>)}
                            cta={<SponsorCta soldOut={avail?.soldOut} />}
                        />
                    );
                })}
            </ul>
            <div className={styles.sponsorNotes}>
                <p>
                    Need an invoice, a W-9, or a custom package? Email{' '}
                    <a href={`mailto:${CONTACT_EMAIL}`} className={styles.inlineLink}>{CONTACT_EMAIL}</a>.
                </p>
                {packetPdf && (
                    <p>
                        <a href={packetPdf} className={styles.textLink} {...EXTERNAL_LINK}>
                            Download the sponsorship packet (PDF)
                        </a>
                    </p>
                )}
                {logoDeadline && <p>To appear in printed materials, sponsor by {logoDeadline}.</p>}
            </div>
        </>
    );
};

// Before the event: levels + CTAs (+ wall once there are sponsors).
// After: only the wall stays, and the section disappears if it's empty.
const GalaSponsor = () => {
    const section = (children) => (
        <section id="sponsor" className={`${styles.section} ${styles.plum}`}>
            <div className={styles.container}>{children}</div>
        </section>
    );
    if (gala.sponsorship.sponsors.length === 0) {
        return <ShowIn states={BEFORE_EVENT}>{section(<SponsorLevels />)}</ShowIn>;
    }
    return section(
        <>
            <ShowIn states={BEFORE_EVENT}><SponsorLevels /></ShowIn>
            <SponsorWall />
        </>,
    );
};

export default GalaSponsor;
