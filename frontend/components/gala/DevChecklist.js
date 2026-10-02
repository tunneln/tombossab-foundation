"use client";

import React from 'react';
import { useGala } from './GalaState';
import { confirmChecklist } from '../../lib/gala';
import styles from './Gala.module.css';

// Development only: a floating list of every TODO_CONFIRM field in
// config/gala-2026.js. NODE_ENV is inlined at build time, so the production
// bundle contains only the `return null`.
const DevChecklist = () => {
    const { state } = useGala();
    if (process.env.NODE_ENV === 'production') return null;

    const items = confirmChecklist();
    const unset = items.filter((i) => i.unset);
    const pending = items.filter((i) => !i.unset);
    return (
        <details className={styles.devPanel}>
            <summary>DEV · gala: {unset.length} unset, {pending.length} to confirm · state: {state}</summary>
            <p>Preview states with ?galaState=coming_soon | on_sale | online_closed | past</p>
            <strong>Unset (hidden or fallback):</strong>
            <ul>{unset.map((i) => <li key={i.path}>{i.path}</li>)}</ul>
            <strong>Set, awaiting confirmation:</strong>
            <ul>{pending.map((i) => <li key={i.path}>{i.path}</li>)}</ul>
        </details>
    );
};

export default DevChecklist;
