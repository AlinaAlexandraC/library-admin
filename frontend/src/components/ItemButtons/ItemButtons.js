import "./ItemButtons.css";
import editIcon from "../../assets/icons/edit.svg";
import saveIcon from "../../assets/icons/save.svg";
import deleteIcon from "../../assets/icons/delete.svg";
import watchedIcon from "../../assets/icons/watched.svg";
import { useState } from "react";
import { editTitle, removeTitle } from "../../services/titleService";

const ItemButtons = ({ title, onDelete, handleSave, editedTitle, isEditing, setIsEditing, handleEdit }) => {
    const [isChecked, setIsChecked] = useState(title ? title.status : false);

    const toggleChecked = async () => {
        const newChecked = !isChecked;
        setIsChecked(newChecked);
        try {
            await editTitle({ ...title, checked: newChecked });
        } catch (error) {
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
            handleSave(editedTitle);
        } catch (error) {
            console.error("Failed to save item:", error);
        }
    };

    const handleDelete = async () => {
        try {
            await removeTitle(title.id);
            onDelete(title.id);
        } catch (error) {
            console.error("Failed to delete item:", error);
        }
    };

    return (
        <div className="item-buttons-container">
            <div className="item-buttons-connector"></div>
            <div className="item-buttons">
                {isEditing ? (
                    <div className="item-buttons-save" >
                        <img src={saveIcon} alt="save-icon" />
                    </div>
                ) : (
                    <div className="item-buttons-edit" onClick={handleEdit}>
                        <img src={editIcon} alt="edit-icon" />
                        <div>Edit</div>
                    </div>
                )}
                <div className={`item-buttons-status ${isChecked ? "checked" : ""}`} onClick={toggleChecked}>
                    <img src={watchedIcon} alt="status-icon" className="" />
                    {isChecked ? (
                        <div>Seen</div>
                    ) : (
                        <div>Not Seen</div>
                    )}
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