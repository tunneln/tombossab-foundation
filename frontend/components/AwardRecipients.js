import React from 'react';
import Link from 'next/link';
import RecipientCard from './RecipientCard';

const AwardRecipients = ({ recipients = [] }) => {
    return (
        <section className="team-area">
            <div className="container">
                <div className="row">
                    <div className="col-lg-8 mx-auto text-center">
                        <div className="section-heading">
                            <div className="section-icon">
                                <img src="/images/section-icon.png" alt="section-icon" />
                            </div>
                            <p className="section__meta">celebrating our scholars</p>
                        </div>
                        <br />
                        <p style={{ color: '#666', fontSize: '1.05rem', lineHeight: 1.75, marginBottom: '2.75rem' }}>
                            Every recipient is a story of heritage, drive, and community. Meet the
                            students our scholarship is proud to support.
                        </p>
                    </div>
                </div>

                <div className="row">
                    {recipients.map(recipient => (
                        <RecipientCard key={recipient.id} recipient={recipient} />
                    ))}
                </div>

                <div className="row">
                    <div className="col-12 text-center" style={{ paddingTop: '1rem', paddingBottom: '2rem' }}>
                        <p style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.25rem', color: '#333' }}>
                            Want to support the next recipient?
                        </p>
                        <Link href="/donatenow" className="theme-btn" style={{ marginRight: '1rem' }}>
                            Donate
                        </Link>
                        <Link href="/apply" className="theme-btn">
                            Apply for the Scholarship
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AwardRecipients;
