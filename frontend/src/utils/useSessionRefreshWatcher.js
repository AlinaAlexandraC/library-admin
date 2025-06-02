import { useEffect, useRef, useCallback, useState } from "react";
import { auth } from "../config/firebase";
import { onAuthStateChanged } from "firebase/auth";

const INACTIVITY_LIMIT = 55 * 60 * 1000;

const useSessionRefreshWatcher = (setShowModal) => {
    const timerIdRef = useRef(null);
    const manualLogoutRef = useRef(false);
    const [expired, setExpired] = useState(false);

    const resetTimer = useCallback(() => {
        clearTimeout(timerIdRef.current);
        setExpired(false);
        timerIdRef.current = setTimeout(() => {
            setExpired(true);
            setShowModal(true);
        }, INACTIVITY_LIMIT);
    }, [setShowModal]);

    const signOutUser = useCallback(async () => {
        manualLogoutRef.current = true;
        clearTimeout(timerIdRef.current);
        timerIdRef.current = null;
        setShowModal(false);
        await auth.signOut();
        window.location.replace("/");
    }, [setShowModal]);

    useEffect(() => {
        if (!auth.currentUser) return;

        resetTimer();

        const activityHandler = () => {
            if (!expired) resetTimer();
        };

        const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
        events.forEach(evt => window.addEventListener(evt, activityHandler));

        const unsubscribe = onAuthStateChanged(auth, user => {
            if (user) {
                resetTimer();
            } else {
                if (!manualLogoutRef.current) {
                    setExpired(true);
                    setShowModal(true);
                }
            }
        });

        return () => {
            events.forEach(evt => window.removeEventListener(evt, activityHandler));
            unsubscribe();
            clearTimeout(timerIdRef.current);
        };
    }, [resetTimer, signOutUser, expired, setShowModal]);

    return { expired, signOutUser, resetTimer };
};

export default useSessionRefreshWatcher;
