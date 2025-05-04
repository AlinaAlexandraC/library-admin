import { useEffect } from "react";
import { auth } from "../config/firebase";
import { onAuthStateChanged } from "firebase/auth";

const useSessionRefreshWatcher = (setShowModal) => {
    useEffect(() => {
        let timeoutId;

        const setupTimer = (user) => {
            if (!user) return;

            timeoutId = setTimeout(() => {
                setShowModal(true);
            }, 55 * 60 * 1000);
        };

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            clearTimeout(timeoutId);
            if (user) setupTimer(user);
        });

        return () => {
            unsubscribe();
            clearTimeout(timeoutId);
        };
    }, [setShowModal]);

    return;
};

export default useSessionRefreshWatcher;