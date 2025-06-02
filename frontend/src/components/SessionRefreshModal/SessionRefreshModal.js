import './SessionRefreshModal.css';

const SessionRefreshModal = ({ message, onClose, onLogout, expired = false }) => {
    return (
        <div className="session-refresh-modal-container">
            <div className="modal">
                <p>{message}</p>
                {expired ? (
                    <button className="server-status-close-button" onClick={() => window.location.replace('/')}>
                        Go to Login
                    </button>
                ) : (
                    <div className="buttons">
                        <button className="server-status-close-button" onClick={onClose}>
                            Stay logged in
                        </button>
                        <button className="server-status-close-button" onClick={onLogout}>
                            Log out
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SessionRefreshModal;