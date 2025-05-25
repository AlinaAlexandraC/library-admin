import './SessionRefreshModal.css';
import { auth } from '../../config/firebase';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';

const SessionRefreshModal = ({ message, onClose }) => {
    const [expired, setExpired] = useState(false);
    const [handled, setHandled] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(async () => {
            if (!handled) {
                setExpired(true);
                await auth.signOut();
            }
        }, 60000 * 5);

        return () => clearTimeout(timeout);
    }, [handled]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user && !handled) {
                setExpired(true);
            }
        });

        return () => unsubscribe();
    }, [handled]);

    const handleStayLoggedIn = () => {
        setHandled(true);
        onClose();
    };

    const handleLogOut = async () => {
        setHandled(true);
        onClose();
        await auth.signOut();
        window.location.replace('/');
    };

    return (
        expired ? (
            <div className="session-refresh-modal-container">
                <div className="modal">
                    <p>Your session has expired. Please log in again.</p>
                    <button
                        className="server-status-close-button"
                        onClick={() => window.location.replace('/')}
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        ) : (
            <div className="session-refresh-modal-container">
                <div className="modal">
                    <p>{message}</p>
                    <div className="buttons">
                        <button className="server-status-close-button" onClick={handleStayLoggedIn}>Stay logged in</button>
                        <button className="server-status-close-button" onClick={handleLogOut}>Log out</button>
                    </div>
                </div>
            </div>
        )
    );
};

export default SessionRefreshModal;