import "./LibraryItem.css";
import editIcon from "../../assets/icons/edit.svg";
import saveIcon from "../../assets/icons/save.svg";
import deleteIcon from "../../assets/icons/delete.svg";
import watchedIcon from "../../assets/icons/watched.svg";
import getIcon from "../../utils/getIcon";
import { editTitle, removeTitle } from "../../services/titleService";
import { useState } from "react";

const LibraryItem = ({ title, onDelete, handleSave }) => {
    const icon = getIcon(title?.type || "defaultType");
    const [isChecked, setIsChecked] = useState(title.checked);
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState({ ...title });

    const toggleChecked = async () => {
        setIsChecked(prev => !prev);
        try {
            await editTitle({ ...title, checked: !isChecked });
        } catch (error) {
            setIsChecked(prev => !prev);
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
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

    const handleChange = (event) => {
        const { name, value } = event.target;
        setEditedTitle((prevTitle) => ({
            ...prevTitle,
            [name]: value,
        }));
    };

    return (
        <div className="library-item-wrapper">
            <div className="library-item">
                <img src={icon} alt="anime-icon" className="type-icon" />
                <div className="title-info">
                    {isEditing ? (
                        <input type="text" name="title" value={editedTitle.title} onChange={handleChange} className="title-input" />
                    ) : (
                        <span className="name">{title.title}</span>
                    )}
                    {
                        title.type === 'Anime' && (
                            <div className="other-information non-mobile">
                                {isEditing ? (
                                    <div>
                                        <select name="genre" id="genre" className="genre-select" value={editedTitle.genre} onChange={handleChange}>
                                            {["Select genre", "Isekai", "Shonen", "Mecha", "Slice of Life", "Romance", "Ecchi", "Other"].map((option, index) => (
                                                <option key={index} value={option}>{option}</option>
                                            ))}
                                        </select>
                                        {title.genre && <span className="divider"> | </span>}
                                        <input type="number" name="no_of_seasons" value={editedTitle.no_of_seasons} onChange={handleChange} className="no_of_seasons-input" />
                                        {(title.no_of_seasons && title.no_of_pages) && <span className="divider"> | </span>}
                                        <input type="number" name="no_of_pages" value={editedTitle.no_of_pages} onChange={handleChange} className="no_of_pages-input" />
                                    </div>
                                ) : (
                                    <div>
                                        {title.genre && <span>{title.genre}</span>}
                                        {title.genre && <span className="divider"> | </span>}
                                        {title.no_of_seasons && <span>{title.no_of_seasons} Season(s)</span>}
                                        {(title.no_of_seasons && title.no_of_pages) && <span className="divider"> | </span>}
                                        {title.no_of_pages && <span>{title.no_of_pages} episode(s)</span>}
                                    </div>
                                )}
                            </div>
                        )
                    }
                    {
                        title.type === 'Anime' && (
                            <div className="other-information mobile">
                                {isEditing ? (
                                    <div>
                                        <select name="genre" id="genre" className="genre" value={editedTitle.genre} onChange={handleChange}>
                                            {["Select genre", "Isekai", "Shonen", "Mecha", "Slice of Life", "Romance", "Ecchi", "Other"].map((option, index) => (
                                                <option key={index} value={option}>{option}</option>
                                            ))}
                                        </select>
                                        {title.genre && <span className="divider"> | </span>}
                                        <input type="number" name="no_of_seasons" value={editedTitle.no_of_seasons} onChange={handleChange} />
                                        {(title.no_of_seasons && title.no_of_pages) && <span className="divider"> | </span>}
                                        <input type="number" name="no_of_pages" value={editedTitle.no_of_pages} onChange={handleChange} />
                                    </div>
                                ) : (
                                    <div>
                                        {title.genre && <span>{title.genre}</span>}
                                        {title.genre && <span> | </span>}
                                        {title.no_of_seasons && <span>{title.no_of_seasons} S</span>}
                                        {(title.no_of_seasons && title.no_of_pages) && <span> | </span>}
                                        {title.no_of_pages && <span>{title.no_of_pages} E</span>}
                                    </div>
                                )}
                            </div>
                        )
                    }
                    {title.type === 'Book' &&
                        <span className="author">by {title.author}</span>
                    }
                    {
                        title.type === 'Series' && (
                            <div className="other-information non-mobile">
                                <span>{title.no_of_seasons ? `${title.no_of_seasons} Season(s)` : ""}</span>
                                <span>{title.no_of_pages ? "|" : ""}</span>
                                <span>{title.no_of_pages ? `${title.no_of_pages} episodes` : ""} </span>
                            </div>
                        )
                    }
                    {
                        title.type === 'Series' && (
                            <div className="other-information mobile">
                                {title.no_of_seasons && <span>{title.no_of_seasons} S</span>}
                                {(title.no_of_seasons && title.no_of_pages) && <span > | </span>}
                                {title.no_of_pages && <span>{title.no_of_pages} E</span>}
                            </div>
                        )
                    }
                    {title.type === 'Manga' &&
                        <span className="chapters">{title.no_of_pages ? `${title.no_of_pages} chapters` : ""} </span>
                    }
                </div>
            </div>
            <div className="library-item-buttons">
                {isEditing ? (
                    <div className="library-item-save" onClick={handleSaveClick}>
                        <img src={saveIcon} alt="save-icon" />
                    </div>
                ) : (
                    <div className="library-item-edit" onClick={handleEdit}>
                        <img src={editIcon} alt="edit-icon" />
                    </div>
                )}
                <div className={`library-item-status ${isChecked ? "checked" : ""}`} onClick={toggleChecked}>
                    <img src={watchedIcon} alt="edit-icon" />
                </div>
                <div className="library-item-delete" onClick={handleDelete}>
                    <img src={deleteIcon} alt="edit-icon" />
                </div>
            </div>
        </div>
    );
};

export default LibraryItem;