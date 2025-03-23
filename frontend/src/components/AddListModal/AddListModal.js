import { useState } from "react";

const AddListModal = ({ onSave, onClose }) => {
    const [listName, setListName] = useState("");
    const [error, setError] = useState("");

    const handleSave = () => {
        if (!listName.trim()) {
            setError("List name cannot be empty");
            return;
        }

        onSave(listName);
        setListName("");
        setError("");
    };

    return (
        <div className="add-list-modal-container overlay">
            <div className="modal">
                <h3>Create a list</h3>
                <input type="text" placeholder="Enter list name" value={listName} onChange={(e) => setListName(e.target.value)} />
                <div className="modal-actions">
                    <button onClick={handleSave} className="save-btn btn">Create List</button>
                    <button onClick={onClose} className="cancel-btn btn">Cancel</button>
                </div>
                {error && <p className="error"> {error}</p>}
            </div>
        </div >
    );
};

export default AddListModal;