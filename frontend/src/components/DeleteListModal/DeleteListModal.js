import "./DeleteListModal.css";
import { useState } from "react";
import { fetchData } from "../../services/apiService";

const DeleteListModal = ({ listName, listId, titleCount, onClose, setUserLists, setFloatingMessage }) => {
    const [deleteType, setDeleteType] = useState("list");
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (titleCount > 0 && !deleteType) {
            setFloatingMessage({ type: "info", text: "Please select whether you want to delete just the list or the list along with its titles." });
            setTimeout(() => setFloatingMessage(null), 3000);
            return;
        }

        setIsDeleting(true);

        const deleteTitles = deleteType.toLowerCase() === "all";

        try {
            const endpoint = deleteTitles ? "lists/deleteAll" : "lists/delete";
            const response = await fetchData(endpoint, "DELETE", {
                listId,
                deleteTitles,
            });

            if (response.success) {
                let message = "";

                if (titleCount === 0) {
                    message = "List was successfully deleted.";
                } else if (deleteTitles) {
                    message = "List and its titles were successfully deleted.";
                } else {
                    message = "Titles were successfully moved to the default lists.";
                }

                setFloatingMessage({ type: "success", text: message });
                setTimeout(() => setFloatingMessage(null), 3000);

                setUserLists(prevLists => prevLists.filter(list => list._id !== listId));
                onClose();
            } else {
                setFloatingMessage({ type: "error", text: "Failed to delete the list. Please try again." });
                setTimeout(() => setFloatingMessage(null), 3000);
            }
        } catch (error) {
            setFloatingMessage({ type: "error", text: error.message || "Failed to delete the list." });
            setTimeout(() => setFloatingMessage(null), 3000);
        } finally {
            setIsDeleting(false);
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
                <button onClick={handleDelete} className="delete-list-btn" disabled={isDeleting}>
                    {isDeleting ? "Deleting..." : "Delete List"}
                </button>
                <button onClick={onClose} className="cancel-btn">
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default DeleteListModal;