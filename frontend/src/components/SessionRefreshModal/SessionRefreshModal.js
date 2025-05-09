import './SessionRefreshModal.css';
import { auth } from '../../config/firebase';

const SessionRefreshModal = ({ message, onClose }) => {
    const handleStayLoggedIn = () => {
        onClose();
    };

    const handleLogOut = async () => {
        onClose();
        await auth.signOut();
        window.location.replace('/');
    };

    // testing render

    return (
        <div className="session-refresh-modal-container">
            <div className="modal">
                <p>{message}</p>
                <div className="buttons-container">
                    <button className="server-status-close-button" onClick={handleStayLoggedIn}>Stay logged in</button>
                    <button className="server-status-close-button" onClick={handleLogOut}>Log out</button>
                </div>
            </div>
        </div>
    );
};

export default SessionRefreshModal;