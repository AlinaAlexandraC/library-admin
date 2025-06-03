import './SessionRefreshModal.css';

const SessionRefreshModal = ({ message }) => {
    return (
        <div className="session-refresh-modal-container">
            <div className="modal">
                <p>{message}</p>
                <button className="server-status-close-button" onClick={() => window.location.replace('/')}>
                    Go to Login
                </button>
            </div>
        </div>
    );
};

export default SessionRefreshModal;