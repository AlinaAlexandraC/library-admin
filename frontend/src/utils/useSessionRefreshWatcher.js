import { useEffect, useRef } from "react";
import { auth } from "../config/firebase";
import { onAuthStateChanged } from "firebase/auth";

const useSessionRefreshWatcher = (setShowModal) => {
    const timerIdRef = useRef(null);

    const startTimer = () => {
        clearTimeout(timerIdRef.current);

        timerIdRef.current = setTimeout(() => {
            setShowModal(true);
            startTimer();
        }, 55 * 60 * 1000);
    };

    useEffect(() => {
        if (auth.currentUser) {
            startTimer();
        }

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            clearTimeout(timerIdRef.current);
            if (user) startTimer();
        });

        return () => {
            unsubscribe();
            clearTimeout(timerIdRef.current);
        };
    }, [setShowModal]);

    return null;
};

export default useSessionRefreshWatcher;