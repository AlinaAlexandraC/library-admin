import './AddListModal.css';
import { useState } from "react";
import { reservedNames } from "../../utils/constants";

const AddListModal = ({ onSave, onClose, existingLists, setFloatingMessage }) => {
    const [listName, setListName] = useState("");

    const handleSave = () => {
        const trimmedName = listName.trim();

        if (!trimmedName) {
            setFloatingMessage({ type: "error", text: "List name cannot be empty" });
            setTimeout(() => setFloatingMessage(null), 3000);
            return;
        }

        if (reservedNames.some(name => name.toLowerCase() === trimmedName.toLowerCase())) {
            setFloatingMessage({ type: "error", text: "This list name is reserved and cannot be used." });
            setTimeout(() => setFloatingMessage(null), 3000);
            return;
        }

        if (existingLists.some(list => list.toLowerCase() === trimmedName.toLowerCase())) {
            setFloatingMessage({ type: "error", text: "A list with this name already exists." });
            setTimeout(() => setFloatingMessage(null), 3000);
            return;
        }

        onSave(trimmedName);
        setListName("");
    };

    return (
        <div className="add-list-modal-container">
            <h3>Create a list</h3>
            <input type="text" placeholder="Enter list name" value={listName} onChange={(e) => setListName(e.target.value)} />
            <div className="modal-actions">
                <button onClick={handleSave} className="save-btn">Create List</button>
                <button onClick={onClose} className="cancel-btn">Cancel</button>
            </div>
        </div >
    );
};

export default AddListModal;