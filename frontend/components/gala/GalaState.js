"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { defaultGalaState, getGalaState, nowOverride, stateOverride } from '../../lib/gala';

// The gala's live state (coming_soon | on_sale | online_closed | past), provided
// once for the whole app from the root layout. Every consumer (header button,
// homepage slide, /events card, checkout pop-up, /gala sections) reads this one
// copy, so they can't disagree at a cutoff and a single timer drives them all.
//
// `initialState` is computed by the server when the page is rendered (at build,
// then at each hourly revalidation), so the static HTML is right as of that
// render, and the browser's first render matches it exactly (no hydration
// mismatch). After mount the state is recomputed from the browser's clock and
// re-checked every minute. `now` stays null until then, so date-dependent UI
// (countdown, Giving Tuesday line) renders nothing at build time instead of a
// frozen value.
//
// In development, ?galaState=past (or any state) overrides the state, and
// ?galaNow=<ISO timestamp> overrides the clock.
const GalaStateContext = createContext({ state: defaultGalaState(), now: null });

export const GalaStateProvider = ({ initialState, children }) => {
    const [state, setState] = useState(initialState ?? defaultGalaState);
    const [now, setNow] = useState(null);

    useEffect(() => {
        const tick = () => {
            const date = nowOverride(window.location.search) ?? new Date();
            setNow(date);
            setState(stateOverride(window.location.search) ?? getGalaState(date));
        };
        tick();
        const timer = setInterval(tick, 60_000);
        return () => clearInterval(timer);
    }, []);

    // Once the browser's state is applied (after mount), expose it as
    // <html data-gala-state="...">, so tests (and dev tools) can tell the page
    // reflects the browser's clock rather than the render-time state.
    useEffect(() => {
        if (now) document.documentElement.dataset.galaState = state;
    }, [state, now]);

    const value = useMemo(() => ({ state, now }), [state, now]);
    return <GalaStateContext.Provider value={value}>{children}</GalaStateContext.Provider>;
};

export const useGala = () => useContext(GalaStateContext);

// Render children only in the listed states. `until` (ISO) also hides them once
// that moment has passed (checked only after mount, when the date is known).
export const ShowIn = ({ states, until, children }) => {
    const { state, now } = useGala();
    if (!states.includes(state)) return null;
    if (until && (!now || now.getTime() > new Date(until).getTime())) return null;
    return children;
};
