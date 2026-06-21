import React from 'react';

const ACCENT = '#f1ae44';
const ACCENT_SOFT = 'rgba(241, 174, 68, 0.12)';

const RecipientCard = ({ recipient }) => {
    const {
        name,
        year,
        scholarship,
        headline,
        photo,
        photoAlt,
        school,
        major,
        highlights = [],
        story = [],
        quote,
        quoteAttribution,
    } = recipient;

    return (
        <div className="col-12" style={{ marginBottom: '2.5rem' }}>
            <div style={{
                background: '#fff',
                borderRadius: '10px',
                boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
                padding: '2.25rem',
            }}>
                <div className="row align-items-start">
                    <div className="col-md-3 text-center" style={{ marginBottom: '1.5rem' }}>
                        <div style={{
                            width: '160px',
                            height: '160px',
                            borderRadius: '50%',
                            overflow: 'hidden',
                            margin: '0 auto',
                            border: `4px solid ${ACCENT}`,
                        }}>
                            <img
                                src={photo}
                                alt={photoAlt || `${name}, ${year} recipient`}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>
                        <div style={{ marginTop: '1rem' }}>
                            {scholarship && (
                                <p style={{
                                    fontSize: '0.72rem',
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.08em',
                                    color: ACCENT,
                                    margin: '0 0 0.2rem',
                                }}>
                                    {scholarship}
                                </p>
                            )}
                            {year && (
                                <p style={{ fontSize: '0.85rem', color: '#888', margin: 0 }}>
                                    {year} Recipient
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="col-md-9">
                        <h3 style={{ marginTop: 0, marginBottom: '0.2rem', fontSize: '1.45rem', color: '#20242a' }}>
                            {name}
                            {headline && (
                                <span style={{ fontWeight: 400, color: '#666' }}>: {headline}</span>
                            )}
                        </h3>

                        {(school || major) && (
                            <p style={{ color: '#888', marginBottom: '1rem', fontSize: '0.92rem' }}>
                                {[school, major].filter(Boolean).join(' · ')}
                            </p>
                        )}

                        {highlights.length > 0 && (
                            <ul style={{
                                listStyle: 'none',
                                padding: 0,
                                margin: '0 0 1.25rem',
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '0.45rem',
                            }}>
                                {highlights.map((h) => (
                                    <li key={h} style={{
                                        background: ACCENT_SOFT,
                                        color: ACCENT,
                                        borderRadius: '999px',
                                        padding: '0.28rem 0.85rem',
                                        fontSize: '0.78rem',
                                        fontWeight: 600,
                                    }}>
                                        {h}
                                    </li>
                                ))}
                            </ul>
                        )}

                        {story.length > 0 && (
                            <div style={{ lineHeight: 1.78, color: '#444' }}>
                                {story.map((para, i) => (
                                    <p key={i} style={{ marginBottom: i < story.length - 1 ? '0.85rem' : 0 }}>
                                        {para}
                                    </p>
                                ))}
                            </div>
                        )}

                        {quote && (
                            <blockquote style={{
                                margin: '1.5rem 0 0',
                                padding: '1rem 1.25rem',
                                borderLeft: `3px solid ${ACCENT}`,
                                background: ACCENT_SOFT,
                                borderRadius: '0 8px 8px 0',
                                fontStyle: 'italic',
                            }}>
                                <p style={{ margin: 0, fontSize: '0.98rem', lineHeight: 1.65 }}>
                                    &ldquo;{quote}&rdquo;
                                </p>
                                {quoteAttribution && (
                                    <cite style={{
                                        display: 'block',
                                        marginTop: '0.6rem',
                                        fontStyle: 'normal',
                                        fontWeight: 600,
                                        color: '#666',
                                        fontSize: '0.88rem',
                                    }}>
                                        — {quoteAttribution}
                                    </cite>
                                )}
                            </blockquote>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecipientCard;
