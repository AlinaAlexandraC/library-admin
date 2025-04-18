import "./ServerStatusModal.css";

const ServerStatusModal = ({ message, showModal, onClose }) => {
    if (!message || !showModal) return null;

    return (
        <div className="server-status-modal-container overlay">
            <div className="modal">
                <p>{message}</p>
                <button className="server-status-close-button" onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default ServerStatusModal;