"use client";

import React, { createContext, useContext } from 'react';
import useGalaState from './useGalaState';
import { defaultGalaState } from '../../lib/gala';

// One live state for the whole /gala page (see useGalaState), shared through
// context so the sections stay server components and only the state-dependent
// bits are wrapped in <ShowIn>.
const GalaStateContext = createContext({ state: defaultGalaState(), now: null });

export const GalaStateProvider = ({ children }) => (
    <GalaStateContext.Provider value={useGalaState()}>{children}</GalaStateContext.Provider>
);

export const useGala = () => useContext(GalaStateContext);

// Render children only in the listed states. `until` (ISO) also hides them once
// that moment has passed (checked only after mount, when the date is known).
export const ShowIn = ({ states, until, children }) => {
    const { state, now } = useGala();
    if (!states.includes(state)) return null;
    if (until && (!now || now.getTime() > new Date(until).getTime())) return null;
    return children;
};
