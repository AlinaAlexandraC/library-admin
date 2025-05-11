import "./DeleteListModal.css";
import { useState } from "react";
import { fetchData } from "../../services/apiService";

const DeleteListModal = ({ listName, listId, titleCount, onClose, setUserLists, setDeleteConfirmation }) => {
    const [deleteType, setDeleteType] = useState("list");
    const [error, setError] = useState("");

    const handleDelete = async () => {
        if (titleCount > 0 && !deleteType) {
            setError("Please select whether you want to delete just the list or the list along with its titles.");
            return;
        }

        const deleteTitles = deleteType.toLowerCase() === "all";

        try {
            const endpoint = deleteTitles ? "lists/deleteAll" : "lists/delete";
            const response = await fetchData(endpoint, "DELETE", {
                listId,
                deleteTitles,
            });

            if (response.success) {
                if (!deleteTitles) {
                    setDeleteConfirmation("Titles were successfully moved to the default lists.");
                    setTimeout(() => setDeleteConfirmation(""), 5000);
                }
                setUserLists(prevLists => prevLists.filter(list => list._id !== listId));
                onClose();
            } else {
                setError("Failed to delete the list. Please try again.");
                setTimeout(() => {
                    setError("");
                }, 3000);
            }
        } catch (error) {
            setError(error.message || "Failed to delete the list.");
            setTimeout(() => {
                setError("");
            }, 3000);
        }
    };

    return (
        <div className="delete-list-modal">
            <h3>Delete the list</h3>
            <p>Are you sure you permanently want to delete the <strong>{listName}</strong> list?</p>
            {titleCount > 0 && (
                <div className="delete-list-radio">
                    <label>
                        <input type="radio" name="deleteType" value="list" onChange={(e) => setDeleteType(e.target.value)} />
                        Delete List Only
                    </label>
                    <label>
                        <input type="radio" name="deleteType" value="all" onChange={(e) => setDeleteType(e.target.value)} />
                        Delete List and Titles
                    </label>
                </div>
            )}
            <div className="modal-actions">
                <button onClick={handleDelete} className="delete-list-btn">Delete List</button>
                <button onClick={onClose} className="cancel-btn">Cancel</button>
            </div>
            {error && <p className="error">{error}</p>}
        </div>
    );
};

export default DeleteListModal;