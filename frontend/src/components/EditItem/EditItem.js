import { useState, useEffect } from "react";
import "./EditItem.css";
import { fetchData } from "../../services/apiService";
import { genreDropdown, typeDropdown } from "../../utils/constants";
import { reservedNames } from "../../utils/constants";

const EditItem = ({ title, onClose, setTitles, setFloatingMessage, refreshTitles }) => {
    const [editedTitle, setEditedTitle] = useState({ ...title });
    const [customLists, setCustomLists] = useState([]);
    const [isSaving, setIsSaving] = useState(false);
    const [isMovingToDefault, setIsMovingToDefault] = useState(false);
    const [currentListId, setCurrentListId] = useState(title.listId || null);
    const [originalListName, setOriginalListName] = useState(null);

    useEffect(() => {
        const fetchLists = async () => {
            try {
                const lists = await fetchData("lists");

                const filtered = lists.filter((list) => !reservedNames.includes(list.name));
                setCustomLists(filtered);

                const currentList = lists.find((list) =>
                    list.titles?.some((t) => t.title_id._id === title._id)
                );

                if (currentList) {
                    setCurrentListId(currentList._id);
                    setEditedTitle((prev) => ({
                        ...prev,
                        listName: currentList.name,
                    }));
                    setOriginalListName(currentList.name);
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
        setIsSaving(true);

        const handleListUpdateResponse = async (listRes) => {
            setTitles((prevTitles) => prevTitles.filter((t) => t._id !== editedTitle._id));
            await refreshTitles();

            if (listRes.message) {
                setFloatingMessage({ text: listRes.message, type: "success" });
                setTimeout(() => setFloatingMessage(null), 3000);
                return;
            }
        };

        try {
            const payload = {
                title_id: editedTitle._id,
                updatedData: editedTitle,
            };

            const selectedCustomList = customLists.find((list) => list.name === editedTitle.listName);
            const selectedListId = selectedCustomList?._id;
            const listChanged = selectedListId && selectedListId !== currentListId;
            const typeChanged = editedTitle.type !== title.type;
            const isInDefault = reservedNames.includes(editedTitle.listName);

            const detailsRes = await fetchData("titles/updateDetails", "PATCH", payload);

            await refreshTitles();

            if (detailsRes.message) {
                setFloatingMessage({ text: detailsRes.message, type: "success" });
                setTimeout(() => setFloatingMessage(null), 3000);
            }

            if (typeChanged && isInDefault) {
                const listPayload = {
                    title_id: editedTitle._id,
                    newListId: editedTitle.type,
                };

                const listRes = await fetchData("titles/updateList", "PATCH", listPayload);

                await handleListUpdateResponse(listRes);
            }

            if (listChanged) {
                const listPayload = {
                    title_id: editedTitle._id,
                    newListId: selectedListId,
                };

                const listRes = await fetchData("titles/updateList", "PATCH", listPayload);

                await handleListUpdateResponse(listRes);
            }
        } catch (error) {
            console.error("Failed to save item:", error);
            setFloatingMessage({
                text: error?.response?.data?.message || error.message || "An unexpected error occurred.",
                type: "error"
            });
            setTimeout(() => setFloatingMessage(null), 3000);
        } finally {
            setIsSaving(false);
            onClose();
        }
    };

    const handleMoveToDefault = async () => {
        setIsMovingToDefault(true);
        try {
            const payload = {
                title_id: editedTitle._id,
                newListId: editedTitle.type || "Unknown",
            };

            const res = await fetchData("titles/updateList", "PATCH", payload);

            if (res.message) {
                setFloatingMessage({ text: res.message, type: "success" });
                setTimeout(() => setFloatingMessage(null), 3000);
            }

            setTitles((prev) => prev.filter((item) => item._id !== editedTitle._id));

            onClose();
        } catch (error) {
            console.error("Failed to move title to default list:", error);
            setFloatingMessage({ text: "Failed to move title to default list.", type: "error" });
            setTimeout(() => setFloatingMessage(null), 3000);
        } finally {
            setIsMovingToDefault(false);
        }
    };

    return (
        <div className="edit-item-container">
            <h3>Edit Title</h3>
            <input
                type="text"
                name="title"
                value={editedTitle.title}
                onChange={handleChange}
                className="title-input"
            />
            <select
                name="type"
                id="type"
                className="type-select"
                value={editedTitle.type}
                onChange={handleChange}
            >
                {typeDropdown.map((option, index) => (
                    <option key={index} value={option}>
                        {option}
                    </option>
                ))}
            </select>
            <select
                name="list"
                value={editedTitle.listName || ""}
                onChange={(e) => setEditedTitle((prev) => ({ ...prev, listName: e.target.value }))}
                disabled={customLists.length === 0}
            >
                <option value="">Select a custom list</option>
                {customLists.map((list) => (
                    <option key={list._id} value={list.name}>
                        {list.name}
                    </option>
                ))}
            </select>
            {editedTitle.type === "Anime" && (
                <>
                    <select
                        name="genre"
                        id="genre"
                        className="genre-select"
                        value={editedTitle.genre}
                        onChange={handleChange}
                    >
                        {genreDropdown.map((option, index) => (
                            <option key={index} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                    <input
                        type="text"
                        name="numberOfSeasons"
                        value={editedTitle.numberOfSeasons || ""}
                        onChange={handleChange}
                        className="numberOfSeasons-input"
                        placeholder="no of seasons"
                    />
                    <input
                        type="number"
                        name="numberOfEpisodes"
                        value={editedTitle.numberOfEpisodes || ""}
                        onChange={handleChange}
                        className="numberOfEpisodes-input"
                        placeholder="no of episodes"
                    />
                </>
            )}
            {editedTitle.type === "Book" && (
                <input
                    type="text"
                    name="author"
                    value={editedTitle.author || ""}
                    onChange={handleChange}
                    className="author-input"
                    placeholder="ex. Natsu Hyūga"
                />
            )}
            {editedTitle.type === "Manga" && (
                <input
                    type="number"
                    name="numberOfChapters"
                    value={editedTitle.numberOfChapters || ""}
                    onChange={handleChange}
                    className="numberOfChapters-input"
                    placeholder="no of chapters"
                />
            )}
            {editedTitle.type === "Series" && (
                <>
                    <input
                        type="text"
                        name="numberOfSeasons"
                        value={editedTitle.numberOfSeasons || ""}
                        onChange={handleChange}
                        className="numberOfSeasons-input"
                        placeholder="no of seasons"
                    />
                    <input
                        type="number"
                        name="numberOfEpisodes"
                        value={editedTitle.numberOfEpisodes || ""}
                        onChange={handleChange}
                        className="numberOfEpisodes-input"
                        placeholder="no of episodes"
                    />
                </>
            )}
            <div className="modal-actions">
                <button
                    className={`move-default-btn btn ${isMovingToDefault || reservedNames.includes(originalListName) ? "disabled" : ""}`}
                    onClick={async () => {
                        if (!isMovingToDefault && !reservedNames.includes(originalListName)) {
                            setIsMovingToDefault(true);
                            await handleMoveToDefault();
                            setIsMovingToDefault(false);
                        }
                    }}
                    title="Move this title to the default list matching its type"
                >
                    {isMovingToDefault ? "Moving..." : "Move to Default List"}
                </button>
                <div className="buttons">
                    <button onClick={handleSave} disabled={isSaving} className="save-btn btn">
                        {isSaving ? "Saving..." : "Save"}
                    </button>
                    <button onClick={onClose} className="cancel-btn btn">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditItem;
