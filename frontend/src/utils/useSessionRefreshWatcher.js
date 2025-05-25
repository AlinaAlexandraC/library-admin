import { useEffect, useRef, useCallback } from "react";
import { auth } from "../config/firebase";
import { onAuthStateChanged } from "firebase/auth";

let showModalSetter = null;

export const registerSessionModalSetter = (setterFn) => {
  showModalSetter = setterFn;
};

export const showSessionExpiredModal = () => {
  if (typeof showModalSetter === 'function') {
    showModalSetter(true);
  }
};

const useSessionRefreshWatcher = (setShowModal, resetSignal) => {
    const timerIdRef = useRef(null);

    const startTimer = useCallback(() => {
        clearTimeout(timerIdRef.current);
        timerIdRef.current = setTimeout(() => {
            setShowModal(true);
            timerIdRef.current = null;
        }, 55 * 60 * 1000);
    }, [setShowModal]);

    useEffect(() => {
        if (auth.currentUser) {
            startTimer();
        }

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                startTimer();
            } else {
                clearTimeout(timerIdRef.current);
                timerIdRef.current = null;
            }
        });

        return () => {
            unsubscribe();
            clearTimeout(timerIdRef.current);
        };
    }, [startTimer]);

    useEffect(() => {
        if (resetSignal) {
            startTimer();
        }
    }, [resetSignal, startTimer]);

    return null;
};

export default useSessionRefreshWatcher;