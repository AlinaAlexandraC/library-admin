import "./ItemButtons.css";
import editIcon from "../../assets/icons/edit.svg";
import deleteIcon from "../../assets/icons/delete.svg";
import watchedIcon from "../../assets/icons/watched.svg";
import { useState } from "react";
import { editTitle, removeTitle } from "../../services/titleService";

const ItemButtons = ({ title, setTitles, openModal }) => {
    const [isChecked, setIsChecked] = useState(title.status);

    const toggleChecked = async () => {
        const newChecked = !isChecked;
        setIsChecked(newChecked);
    
        try {
            const updatedTitle = await editTitle({ ...title, status: newChecked });
    
            setTitles((prevTitles) =>
                prevTitles.map(t => t._id === updatedTitle._id ? updatedTitle : t)
            );
        } catch (error) {
            console.error("Error updating status:", error);
            setIsChecked(!newChecked);
        }
    };

    const handleDelete = async () => {
        try {
            await removeTitle(title._id);
            setTitles((prevTitles) => prevTitles.filter(t => t._id !== title._id));
        } catch (error) {
            console.error("Failed to delete item:", error);
        }
    };

    return (
        <div className="item-buttons-container">
            <div className="item-buttons">
                <div className="item-buttons-edit" onClick={() => openModal(title)}>
                    <img src={editIcon} alt="edit-icon" />
                    <div>Edit</div>
                </div>
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