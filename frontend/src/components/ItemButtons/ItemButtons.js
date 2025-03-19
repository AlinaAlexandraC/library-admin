import "./ItemButtons.css";
import editIcon from "../../assets/icons/edit.svg";
import saveIcon from "../../assets/icons/save.svg";
import deleteIcon from "../../assets/icons/delete.svg";
import watchedIcon from "../../assets/icons/watched.svg";
import { useState } from "react";
import { editTitle, removeTitle } from "../../services/titleService";

const ItemButtons = ({ title, setTitles, editedTitle, isEditing, setIsEditing, handleEdit }) => {
    const [isChecked, setIsChecked] = useState(title.status);

    const toggleChecked = async () => {
        const newChecked = !isChecked;
        setIsChecked(newChecked);

        try {
            const updatedTitle = await editTitle({ ...title, status: newChecked });
            setTitles((prevTitles) =>
                prevTitles.map(title => title._id === updatedTitle._id ? updatedTitle : title));
        } catch (error) {
            console.error("Error updating status:", error);
            setIsChecked(!newChecked);
        }
    };

    const handleSaveClick = async () => {
        try {
            const response = await editTitle(editedTitle);

            if (!response || response.error) {
                throw new Error("Failed to update title");
            }

            setIsEditing(false);
            setTitles((prevTitles) =>
                prevTitles.map(title => title._id === response.updatedTitle._id ? response.updatedTitle : title)
            );
        } catch (error) {
            console.error("Failed to save item:", error);
        }
    };

    const handleDelete = async () => {
        try {
            const response = await removeTitle(title._id);

            if (!response || response.error) {
                throw new Error("Failed to delete title");
            }

            setTitles((prevTitles) => prevTitles.filter(titleToRemove => titleToRemove._id !== title._id));
        } catch (error) {
            console.error("Failed to delete item:", error);
        }
    };

    return (
        <div className="item-buttons-container">
            <div className="item-buttons-connector"></div>
            <div className="item-buttons">
                {isEditing ? (
                    <div className="item-buttons-save" onClick={handleSaveClick}>
                        <img src={saveIcon} alt="save-icon" />
                        <div>Save</div>
                    </div>
                ) : (
                    <div className="item-buttons-edit" onClick={handleEdit}>
                        <img src={editIcon} alt="edit-icon" />
                        <div>Edit</div>
                    </div>
                )}
                <div className={`item-buttons-status ${isChecked ? "checked" : ""}`} onClick={toggleChecked}>
                    <img src={watchedIcon} alt="status-icon" />
                    <div>{isChecked ? "Seen" : "Not Seen"}</div>
                </div>
                <div className="item-buttons-delete" onClick={handleDelete}>
                    <img src={deleteIcon} alt="delete-icon" />
                    <div>Delete</div>
                </div>
            </div>
        </div >
    );
};

export default ItemButtons;