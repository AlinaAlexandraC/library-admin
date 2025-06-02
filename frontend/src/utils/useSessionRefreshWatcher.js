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
    setExpired(false);
    await auth.signOut();
    window.location.replace("/");
    // Reset the manual logout flag after a short delay to avoid race conditions
    setTimeout(() => {
      manualLogoutRef.current = false;
    }, 1000);
  }, [setShowModal]);

  useEffect(() => {
    const activityHandler = () => {
      if (!expired) resetTimer();
    };

    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    events.forEach((evt) => window.addEventListener(evt, activityHandler));

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setExpired(false);
        resetTimer();
      } else {
        if (!manualLogoutRef.current) {
          setExpired(true);
          setShowModal(true);
        } else {
          setExpired(false);
        }
        // Always clear manualLogoutRef in case of actual logout
        manualLogoutRef.current = false;
      }
    });

    return () => {
      events.forEach((evt) => window.removeEventListener(evt, activityHandler));
      unsubscribe();
      clearTimeout(timerIdRef.current);
    };
  }, [resetTimer, expired, setShowModal]);

  const clearExpired = () => setExpired(false);

  return { expired, signOutUser, resetTimer, clearExpired };
};

export default useSessionRefreshWatcher;
