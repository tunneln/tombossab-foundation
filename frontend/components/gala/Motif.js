import React from 'react';
import styles from './Gala.module.css';

// Thin gold geometric band (abstract, inspired by woven textile borders).
// Pure CSS background, decorative only.
const Motif = ({ className = '' }) => (
    <span className={`${styles.motif} ${className}`.trim()} aria-hidden="true" />
);

export default Motif;
