import "./ItemButtons.css";
import editIcon from "../../assets/icons/edit.svg";
import saveIcon from "../../assets/icons/save.svg";
import deleteIcon from "../../assets/icons/delete.svg";
import watchedIcon from "../../assets/icons/watched.svg";

const ItemButtons = ({ isChecked, isEditing, setIsEditing, toggleChecked }) => {
    const handleEdit = () => {
        setIsEditing(true);
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
                <div className="item-buttons-delete" >
                    <img src={deleteIcon} alt="delete-icon" />
                    <div>Delete</div>
                </div>
            </div>
        </div >
    );
};

export default ItemButtons;