"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { defaultGalaState, galaSlideVisible, getGalaState, nowOverride, stateOverride } from '../../lib/gala';

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
// The state and the clock are separate contexts: the clock ticks every minute,
// but only the few date-dependent pieces read it (useGalaNow), so a minute that
// doesn't change the state re-renders nothing else.
//
// In development, ?galaState=past (or any state) overrides the state, and
// ?galaNow=<ISO timestamp> overrides the clock.
const GalaStateContext = createContext({ state: defaultGalaState(), slideVisible: true });
const GalaClockContext = createContext(null);

// `initialSlideVisible` works like `initialState`: computed by the server at
// render time, so the static homepage drops the gala slide on its own after
// homeSlide.removeAfter (instead of the browser removing it after load).
export const GalaStateProvider = ({ initialState, initialSlideVisible = true, children }) => {
    const [state, setState] = useState(initialState ?? defaultGalaState);
    const [slideVisible, setSlideVisible] = useState(initialSlideVisible);
    const [now, setNow] = useState(null);

    useEffect(() => {
        const tick = () => {
            const date = nowOverride(window.location.search) ?? new Date();
            setNow(date);
            setState(stateOverride(window.location.search) ?? getGalaState(date));
            setSlideVisible(galaSlideVisible(date));
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

    const value = useMemo(() => ({ state, slideVisible }), [state, slideVisible]);
    return (
        <GalaStateContext.Provider value={value}>
            <GalaClockContext.Provider value={now}>{children}</GalaClockContext.Provider>
        </GalaStateContext.Provider>
    );
};

// { state, slideVisible }: re-renders only when one of them changes.
export const useGala = () => useContext(GalaStateContext);

// The browser's current time (null until mount), updated every minute.
export const useGalaNow = () => useContext(GalaClockContext);

// Render children only in the listed states. `until` (ISO) also hides them once
// that moment has passed (checked only after mount, when the date is known);
// only those blocks subscribe to the clock.
export const ShowIn = ({ states, until, children }) => {
    const { state } = useGala();
    if (!states.includes(state)) return null;
    return until ? <Until moment={until}>{children}</Until> : children;
};

const Until = ({ moment, children }) => {
    const now = useGalaNow();
    return now && now.getTime() <= new Date(moment).getTime() ? children : null;
};
