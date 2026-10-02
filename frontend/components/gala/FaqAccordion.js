"use client";

import React, { useState } from 'react';
import styles from './Gala.module.css';

// Accessible accordion: each question is a <button aria-expanded> that controls
// its panel via aria-controls. One item open at a time. Answers arrive as
// server-rendered nodes, so this component only owns the open/closed state.
const FaqAccordion = ({ items }) => {
    const [openId, setOpenId] = useState(null);

    return (
        <ul className={styles.faqList}>
            {items.map(({ id, question, answer }) => {
                const open = openId === id;
                return (
                    <li key={id} className={styles.faqItem}>
                        <h3 className={styles.faqQuestion}>
                            <button
                                type="button"
                                id={`faq-${id}-button`}
                                className={styles.faqButton}
                                aria-expanded={open}
                                aria-controls={`faq-${id}-panel`}
                                onClick={() => setOpenId(open ? null : id)}
                            >
                                {question}
                                <i className="fa fa-chevron-down" aria-hidden="true"></i>
                            </button>
                        </h3>
                        <div
                            id={`faq-${id}-panel`}
                            role="region"
                            aria-labelledby={`faq-${id}-button`}
                            className={styles.faqPanel}
                            hidden={!open}
                        >
                            {answer}
                        </div>
                    </li>
                );
            })}
        </ul>
    );
};

export default FaqAccordion;
