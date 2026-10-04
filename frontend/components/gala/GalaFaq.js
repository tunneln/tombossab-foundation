import React from 'react';
import { gala } from '../../config/gala-2026';
import { formatPrice, hasVenue, providerInfo, tierDeductible, timeRange, venueAddress } from '../../lib/gala';
import FaqAccordion from './FaqAccordion';
import styles from './Gala.module.css';

const EMAIL = <a href="mailto:contact@tombossabfoundation.org" className={styles.inlineLink}>contact@tombossabfoundation.org</a>;

const WhenWhere = () => {
    if (!hasVenue()) {
        return (
            <p>
                {gala.dateDisplay}. Venue and time will be announced soon. Follow us on{' '}
                <a href="https://www.instagram.com/tombossabfoundation" className={styles.inlineLink} target="_blank" rel="noopener noreferrer">Instagram</a>{' '}
                or <a href="#subscribe" className={styles.inlineLink}>subscribe to our newsletter</a> for updates.
            </p>
        );
    }
    const { name, street, city, region, postalCode } = gala.venue;
    const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(venueAddress())}&output=embed`;
    return (
        <>
            <p>{timeRange() ? `${gala.dateDisplay}, ${timeRange()}.` : `${gala.dateDisplay}. Time to be announced.`}</p>
            <p>
                <strong>{name}</strong><br />
                {street && <>{street}<br /></>}
                {[city && `${city}, ${region}`, postalCode].filter(Boolean).join(' ')}
            </p>
            <div className={styles.mapFrame}>
                <iframe src={mapSrc} title={`Map to ${name}`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            </div>
        </>
    );
};

const TaxAnswer = () => {
    // Every option, including $0 (Student & Youth) and Sponsor a Seat.
    const tiers = [...gala.tiers.attend, ...gala.tiers.sponsor, { id: 'seat', ...gala.tiers.give.sponsorSeat }]
        .map((tier) => ({ tier, value: tierDeductible(tier) }))
        .filter(({ value }) => value != null);
    return (
        <>
            <p>
                The Tombossa B Foundation is a 501(c)(3) nonprofit{gala.ein && `, EIN ${gala.ein}`}. The portion of your
                ticket above the value of the dinner and drinks you receive is tax-deductible to the extent allowed by law.
            </p>
            {tiers.length > 0 && (
                <>
                    <p>Estimated tax-deductible amounts:</p>
                    <ul>
                        {tiers.map(({ tier, value }) => <li key={tier.id}>{tier.name}: {formatPrice(value)}</li>)}
                    </ul>
                </>
            )}
        </>
    );
};

// Questions with an unconfirmed answer render a fallback (or are left out);
// the answer text lives in config/gala-2026.js under `faq`.
const GalaFaq = () => {
    const { faq } = gala;
    // Grouped: the evening itself, then buying, then who to ask. Questions
    // answered elsewhere on the page (food: The Evening; Student & Youth
    // eligibility: its ticket card; sponsoring and giving: their sections) are
    // left out on purpose.
    const items = [
        { id: 'wear', question: 'What should I wear?', answer: <p>{gala.dressCode.label}. {gala.dressCode.detail}</p> },
        { id: 'where', question: 'When and where is the gala?', answer: <WhenWhere /> },
        { id: 'bring', question: 'What do I need to bring?', answer: <p>{faq.checkIn}</p> },
        faq.ages && { id: 'ages', question: 'Is the gala open to all ages?', answer: <p>{faq.ages}</p> },
        {
            id: 'access',
            question: 'Is the venue accessible?',
            answer: <p>{faq.accessibility ?? "Please email us with any accessibility needs and we'll make sure you're taken care of."}</p>,
        },
        {
            id: 'others',
            question: 'Can I buy tickets for other people?',
            answer: <p>Yes. You&apos;ll be asked for each guest&apos;s name at checkout so we can have name tags ready.</p>,
        },
        faq.refunds && { id: 'refunds', question: "What's the refund policy?", answer: <p>{faq.refunds}</p> },
        { id: 'tax', question: 'Is my ticket tax-deductible?', answer: <TaxAnswer /> },
        providerInfo()?.tipFaq && {
            id: 'tip',
            question: 'Why does checkout ask for an optional tip?',
            answer: (
                <p>
                    We use Zeffy, a free platform for nonprofits, so the foundation receives your full payment. Zeffy is
                    supported by optional tips. You&apos;re welcome to set the tip to $0.
                </p>
            ),
        },
        faq.auction && {
            id: 'auction',
            question: 'Can I attend the silent auction without a ticket, or bid remotely?',
            answer: <p>{faq.auction}</p>,
        },
        {
            id: 'contact',
            question: 'Who do I contact with questions?',
            answer: <p>Email {EMAIL} or call <a href="tel:2142083936" className={styles.inlineLink}>214 208 3936</a>.</p>,
        },
    ].filter(Boolean);

    return (
        <section id="faq" className={`${styles.section} ${styles.ivoryDeep}`}>
            <div className={styles.container}>
                <div className={`${styles.heading} ${styles.center} ${styles.reveal}`}>
                    <h2 className={styles.title}>Frequently Asked Questions</h2>
                </div>
                <FaqAccordion items={items} />
            </div>
        </section>
    );
};

export default GalaFaq;
