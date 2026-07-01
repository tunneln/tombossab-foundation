import React, { createContext, useContext, useState, useCallback } from 'react';
import DonateModal from './DonateModal';

// A single, app-level donation modal. Because the provider is mounted at the
// _app root, the one modal instance (and the iframe inside it) survives Next's
// client-side route changes — so a donor who closes the form and moves to
// another page finds it exactly as they left it. This mirrors the old
// Donorbox popup, which persisted for the same reason (it lived on document.body,
// outside the swapped page content).
const DonateContext = createContext(null);

export const DonateProvider = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const open = useCallback(() => setIsOpen(true), []);
    const close = useCallback(() => setIsOpen(false), []);

    return (
        <DonateContext.Provider value={{ isOpen, open, close }}>
            {children}
            <DonateModal />
        </DonateContext.Provider>
    );
};

export const useDonate = () => {
    const ctx = useContext(DonateContext);
    if (!ctx) throw new Error('useDonate must be used within a DonateProvider');
    return ctx;
};
