import "./ItemButtons.css";
import editIcon from "../../assets/icons/edit.svg";
import deleteIcon from "../../assets/icons/delete.svg";
import watchedIcon from "../../assets/icons/watched.svg";

const ItemButtons = ({ title, openModal, onToggleStatus, onDelete, loadingAction }) => {
    const isDeleting = loadingAction?.id === title._id && loadingAction?.type === "delete";
    const isSaving = loadingAction?.id === title._id && loadingAction?.type === "save";

    return (
        <div className="item-buttons-container">
            <div className="item-buttons">
                <div className={`item-buttons-edit ${isSaving ? "disabled" : ""}`}
                    onClick={() => !isSaving && openModal(title)}>
                    <img src={editIcon} alt="edit-icon" />
                    <div>Edit</div>
                </div>
                <div
                    className={`item-buttons-status ${title.status ? "checked" : ""}`}
                    onClick={() => onToggleStatus(title)}
                >
                    <img src={watchedIcon} alt="status-icon" />
                    <div>{title.status ? "Seen" : "Not Seen"}</div>
                </div>
                <div className={`item-buttons-delete ${isDeleting ? "disabled" : ""}`}
                    onClick={() => !isDeleting && onDelete(title)}>
                    <img src={deleteIcon} alt="delete-icon" />
                    <div>Delete</div>
                </div>
            </div>
        </div >
    );
};

export default ItemButtons;