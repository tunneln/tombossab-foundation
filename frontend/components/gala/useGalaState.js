"use client";

import { useEffect, useState } from 'react';
import { defaultGalaState, getGalaState, nowOverride, stateOverride } from '../../lib/gala';

// The gala's live state: coming_soon | on_sale | online_closed | past.
//
// Pages are statically generated, so the real date is only known in the
// browser. The first render uses the build-time default (identical on the
// server and in the browser's first pass, so hydration never mismatches); an
// effect then computes the real state after mount and re-checks every minute.
// `now` stays null until mounted, so date-dependent UI (countdown, the Giving
// Tuesday line) renders nothing at build time instead of a frozen value.
//
// In development, ?galaState=past (or any state) overrides the state, and
// ?galaNow=<ISO timestamp> overrides the clock.
const useGalaState = () => {
    const [state, setState] = useState(defaultGalaState);
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

    return { state, now };
};

export default useGalaState;
