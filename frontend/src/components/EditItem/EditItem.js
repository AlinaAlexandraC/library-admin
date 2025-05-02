import { useState, useEffect } from "react";
import "./EditItem.css";
import { fetchData } from "../../services/apiService";

const EditItem = ({ title, onClose, setTitles }) => {
    const [editedTitle, setEditedTitle] = useState({ ...title });
    const [customLists, setCustomLists] = useState([]);
    const [currentListId, setCurrentListId] = useState(title.listId || null);

    useEffect(() => {
        const fetchLists = async () => {
            try {
                const lists = await fetchData("lists");

                const reserved = ["Anime", "Book", "Manga", "Movie", "Series", "Unknown"];
                const filtered = lists.filter(list => !reserved.includes(list.name));
                setCustomLists(filtered);

                const currentList = lists.find(list =>
                    list.titles?.some(t => t.title_id._id === title._id)
                );

                if (currentList) {
                    setCurrentListId(currentList._id);
                    setEditedTitle(prev => ({
                        ...prev,
                        listName: currentList.name,
                    }));
                }
            } catch (error) {
                console.error("Failed to fetch lists:", error);
            }
        };

        fetchLists();
    }, [title._id]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setEditedTitle((prevTitle) => ({
            ...prevTitle,
            [name]: value,
        }));
    };

    const handleSave = async () => {
        try {
            const payload = {
                title_id: editedTitle._id,
                updatedData: editedTitle,
            };

            const selectedCustomList = customLists.find(list => list.name === editedTitle.listName);
            const selectedListId = selectedCustomList?._id;

            const listChanged = selectedListId && selectedListId !== currentListId;

            if (listChanged) {
                payload.newListId = selectedListId;
            }

            const response = await fetchData("titles/update", "PATCH", payload);

            setTitles((prevTitles) =>
                prevTitles.map(title => title._id === response.updatedTitle._id ? response.updatedTitle : title)
            );

            onClose();
        } catch (error) {
            console.error("Failed to save item:", error);
        }
    };

    return (
        <div className="edit-item-container">
            <h3>Edit Title</h3>
            <input type="text" name="title" value={editedTitle.title} onChange={handleChange} className="title-input"
            />
            <select name="type" id="type" className="type-select" value={editedTitle.type} onChange={handleChange}>
                {["Select type", "Anime", "Book", "Manga", "Movie", "Series"].map((option, index) => (
                    <option key={index} value={option}>{option}</option>
                ))}
            </select>
            <select
                name="list"
                value={editedTitle.listName || ""}
                onChange={(e) => setEditedTitle(prev => ({ ...prev, listName: e.target.value }))}
            >
                <option value="">Select a custom list</option>
                {customLists.map(list => (
                    <option key={list._id} value={list.name}>
                        {list.name}
                    </option>
                ))}
            </select>
            {editedTitle.type === "Anime" && (
                <>
                    <select name="genre" id="genre" className="genre-select" value={editedTitle.genre} onChange={handleChange}>
                        {["Select genre", "Isekai", "Shonen", "Mecha", "Slice of Life", "Romance", "Ecchi", "Other"].map((option, index) => (
                            <option key={index} value={option}>{option}</option>
                        ))}
                    </select>
                    <input type="text" name="numberOfSeasons" value={editedTitle.numberOfSeasons || ""} onChange={handleChange} className="numberOfSeasons-input" placeholder="no of seasons"
                    />
                    <input type="number" name="numberOfEpisodes" value={editedTitle.numberOfEpisodes || ""} onChange={handleChange} className="numberOfEpisodes-input" placeholder="no of episodes"
                    />
                </>
            )}
            {editedTitle.type === "Book" && (
                <input type="text" name="author" value={editedTitle.author || ""} onChange={handleChange} className="author-input" placeholder="ex. Natsu Hyūga"
                />
            )}
            {editedTitle.type === "Manga" && (
                <input type="number" name="numberOfChapters" value={editedTitle.numberOfChapters || ""} onChange={handleChange} className="numberOfChapters-input" placeholder="no of chapters"
                />
            )}
            {editedTitle.type === "Series" && (
                <>
                    <input type="text" name="numberOfSeasons" value={editedTitle.numberOfSeasons || ""} onChange={handleChange} className="numberOfSeasons-input" placeholder="no of seasons"
                    />
                    <input type="number" name="numberOfEpisodes" value={editedTitle.numberOfEpisodes || ""} onChange={handleChange} className="numberOfEpisodes-input" placeholder="no of episodes"
                    />
                </>
            )}
            <div className="modal-actions">
                <button onClick={handleSave} className="save-btn btn">Save</button>
                <button onClick={onClose} className="cancel-btn btn">Cancel</button>
            </div>
        </div>
    );
};

export default EditItem;