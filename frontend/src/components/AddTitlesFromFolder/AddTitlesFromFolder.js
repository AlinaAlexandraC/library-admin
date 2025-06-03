import Form from "../Form/Form";
import "./AddTitlesFromFolder.css";
import formImage from "../../assets/images/form-vertical.jpg";
import formImageHorizontal from "../../assets/images/form-horizontal.jpg";
import folderIcon from "../../assets/icons/folder.svg";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import fetchCustomLists from "../../utils/fetchCustomLists";
import { fetchData } from "../../services/apiService";
import { typeDropdown } from "../../utils/constants";

const AddTitlesFromFolder = () => {
    const [titleFormData, setTitleFormData] = useState([]);
    const [floatingMessage, setFloatingMessage] = useState(null);
    const [folderSelected, setFolderSelected] = useState(false);
    const [selectedType, setSelectedType] = useState("");
    const [userLists, setUserLists] = useState([]);
    const [selectedOtakuList, setSelectedOtakuList] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFolderLoading, setIsFolderLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCustomLists(setUserLists);
    }, []);

    const handleFolderSelection = async () => {
        if (!('showDirectoryPicker' in window)) {
            setFloatingMessage({ type: "error", text: "Your browser does not support the File System Access API" });
            return;
        }

        try {
            setIsFolderLoading(true);
            const directoryHandle = await window.showDirectoryPicker();
            const folderNames = [];

            for await (const entry of directoryHandle.values()) {
                folderNames.push(entry.name);
            }

            if (folderNames.length > 0) {
                setTitleFormData(folderNames);
                setFolderSelected(true);
            }
        } catch (error) {
            setFloatingMessage({ type: "error", text: "Error accessing the folder. Try again later." });
            setTimeout(() => setFloatingMessage(null), 3000);
        } finally {
            setIsFolderLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setFloatingMessage({ type: "info", text: "Adding titles, please wait..." });

        if (titleFormData.length === 0) {
            setFloatingMessage({ type: "error", text: "No titles to add. Please select a valid folder." });
            setTimeout(() => setFloatingMessage(null), 3000);
            return;
        }

        let selectedOtakuListId;

        if (selectedOtakuList) {
            selectedOtakuListId = userLists.find(list => list.name === selectedOtakuList);
        }

        const finalTargetList = selectedOtakuListId ? selectedOtakuListId._id : (selectedType || "Unknown");

        try {
            const titles = titleFormData.map(title => ({
                title: title,
                type: selectedType || "",
                genre: "",
                author: "",
                numberOfSeasons: "",
                numberOfEpisodes: "",
                numberOfChapters: "",
                status: false,
            }));

            const response = await fetchData("titles/add", "POST", {
                titles: titles,
                listId: finalTargetList,
                selectedType: selectedType || ""
            });

            const totalSent = titles.length;
            const duplicates = response.duplicates?.length || 0;
            const addedCount = totalSent - duplicates;

            if (response.success) {
                if (addedCount > 0 && duplicates === 0) {
                    setFloatingMessage({ type: "success", text: `${addedCount} title${addedCount > 1 ? "s" : ""} added successfully!` });
                } else if (addedCount > 0 && duplicates > 0) {
                    setFloatingMessage({
                        type: "success",
                        text: `${addedCount} added successfully, ${duplicates} duplicate${duplicates > 1 ? "s were" : " was"} skipped.`,
                    });
                } else if (addedCount === 0 && duplicates > 0) {
                    setFloatingMessage({
                        type: "info",
                        text: `All ${duplicates} titles were duplicates and were skipped.`,
                    });
                }

                setTitleFormData([]);
                setFolderSelected(false);
                setSelectedOtakuList("");
            } else {
                setFloatingMessage({ type: "error", text: "Error adding titles. Try again later." });
            }

            setTimeout(() => setFloatingMessage(null), 3000);
        } catch (error) {
            setFloatingMessage({ type: "error", text: "Failed to connect to server" });
            setTimeout(() => setFloatingMessage(null), 3000);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (event) => {
        const { value } = event.target;
        setSelectedType(value);
    };

    const buttons = folderSelected
        ? [
            {
                label: isSubmitting ? "Adding..." : "Add to list",
                type: "submit",
                className: "add-titles-from-folder-button btn",
                disabled: isSubmitting,
            },
            {
                label: "Select another",
                onClick: () => {
                    setTitleFormData([]);
                    setFolderSelected(false);
                },
                className: "select-another-button btn",
                disabled: isSubmitting,
            }
        ]
        : [
            {
                label: "See list",
                onClick: () => navigate("/lists"),
                className: "see-library-button btn",
            }
        ];

    const instruction = folderSelected ? (
        <>
            Adding <strong>{titleFormData.length} titles </strong> to the <strong>{selectedOtakuList || selectedType || "Unknown"}</strong> list. Duplicates will be removed.
        </>
    ) : null;

    return (
        <div className="add-titles-from-folder-container">
            <Form
                formImage={formImage}
                formImageHorizontal={formImageHorizontal}
                header="Import titles from a folder"
                onSubmit={handleSubmit}
                floatingMessage={floatingMessage && floatingMessage.text ? floatingMessage : null}
                instruction={instruction}
                buttons={buttons}>
                <div className="add-titles-from-folder-content">
                    {!folderSelected && (
                        <div className="select-folder-otaku-list-select-container">
                            <div
                                className={`select-folder-container ${isFolderLoading ? "disabled" : ""}`}
                                onClick={!isFolderLoading ? handleFolderSelection : undefined}
                            >
                                <img src={folderIcon} alt="folder-icon" className="folder-icon" />
                                <span>{isFolderLoading ? "Loading..." : "Select Folder"}</span>
                            </div>
                        </div>
                    )}
                    {titleFormData.length > 0 && (
                        <>
                            <div className="dropdown-lists">
                                <div className="select-folder-titles-type-select">
                                    <label>Type</label>
                                    <select name="type" id="type" className="type-select" value={selectedType} onChange={handleChange}>
                                        {typeDropdown.map((option, index) => (
                                            <option key={index} value={option}>{option}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="select-folder-otaku-list-select">
                                    <label>OtakuList</label>
                                    <select
                                        name="customList"
                                        className="custom-list"
                                        value={selectedOtakuList}
                                        onChange={(e) => setSelectedOtakuList(e.target.value)}
                                        disabled={userLists.length === 0}
                                    >
                                        <option value="">Select a custom list</option>
                                        {userLists.map(list => (
                                            <option key={list._id} value={list.name}>{list.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="titles-list-from-folder">
                                <ul className="extracted-titles-list-container">
                                    {titleFormData.map((title, index) => (
                                        <li key={index} className="extracted-title-container">
                                            <div className="decoration"></div>
                                            <div className="extracted-title">
                                                <span className="extracted-title-index">{index + 1}.</span>
                                                <span className="extracted-title-filename">{title}</span>
                                            </div>
                                            <button type="button" onClick={() => setTitleFormData(titleFormData.filter((_, i) => i !== index))} className="extracted-title-button">x</button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </>
                    )}
                </div>
            </Form>
        </div>
    );
};

export default AddTitlesFromFolder;