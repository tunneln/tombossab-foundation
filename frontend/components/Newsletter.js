import React from 'react';

const Newsletter = ({ newsletters = [] }) => {
    return (
        <section className="blog-area blog-area2">
            <div className="container">
                <div className="row recent-post-wrap">
                    {newsletters.map((item) => (
                        <div className="col-lg-4 col-md-6" key={item.id}>
                            <div className="recent-item" style={{ marginBottom: '30px' }}>
                                <div className="recent__img">
                                    <span className="meta__date-date">{item.month} {item.year}</span>
                                    <a href={item.file} target="_blank" rel="noopener noreferrer">
                                        <img
                                            src={item.cover}
                                            alt={`${item.title} cover`}
                                            style={{ width: '100%', height: 'auto', display: 'block' }}
                                        />
                                    </a>
                                </div>
                                <div className="news__content">
                                    <h3 className="news__content-title">
                                        <a href={item.file} target="_blank" rel="noopener noreferrer">{item.headline}</a>
                                    </h3>
                                    <ul className="news__content-list">
                                        <li className="news__content-active__dot">{item.issue}</li>
                                        <li>PDF</li>
                                    </ul>
                                    <p className="news__content-text">{item.blurb}</p>
                                    <a href={item.file} target="_blank" rel="noopener noreferrer" className="theme-btn">
                                        read newsletter
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Newsletter;
