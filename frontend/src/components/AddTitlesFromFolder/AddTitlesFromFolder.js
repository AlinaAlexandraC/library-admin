import Form from "../Form/Form";
import "./AddTitlesFromFolder.css";
import formImage from "../../assets/images/form-vertical.jpg";
import formImageHorizontal from "../../assets/images/form-horizontal.jpg";
import folderIcon from "../../assets/icons/folder.svg";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import fetchCustomLists from "../../utils/fetchCustomLists";
import { fetchData } from "../../services/apiService";

const AddTitlesFromFolder = () => {
    const [titleFormData, setTitleFormData] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [folderSelected, setFolderSelected] = useState(false);
    const [selectedType, setSelectedType] = useState("");
    const [userLists, setUserLists] = useState([]);
    const [selectedOtakuList, setSelectedOtakuList] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchCustomLists(setUserLists);
    }, []);

    const handleFolderSelection = async () => {
        if (!('showDirectoryPicker' in window)) {
            setError('Your browser does not support the File System Access API');
            return;
        }

        try {
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
            setError("Error accessing the folder. Try again later.");
            setTimeout(() => {
                setError(null);
            }, 3000);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (titleFormData.length === 0) {
            setError("No titles to add. Please select a valid folder.");
            setTimeout(() => {
                setError(null);
            }, 3000);
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

            if (response.success) {
                setSuccess("Titles added successfully!");
                setTimeout(() => {
                    setSuccess("");
                }, 3000);

                setTitleFormData([]);
                setFolderSelected(false);
                setSelectedOtakuList("");
            } else {
                setError("Error adding titles. Try again later.");
                setTimeout(() => {
                    setError(null);
                }, 3000);
            }
        } catch (error) {
            setError("Failed to connect to server");
            setTimeout(() => {
                setError(null);
            }, 3000);
        }
    };

    const handleChange = (event) => {
        const { value } = event.target;
        setSelectedType(value);
    };

    const reselectFolder = () => {
        setTitleFormData([]);
        setFolderSelected(false);
    };

    return (
        <div className="add-titles-from-folder-container">
            <Form formImage={formImage} formImageHorizontal={formImageHorizontal}>
                <form className="add-titles-from-folder-wrapper" onSubmit={handleSubmit} >
                    <div className="add-titles-from-folder-title">Import titles from a folder</div>
                    <div className="add-titles-from-folder-content">
                        {!folderSelected && (
                            <div className="select-folder-container" onClick={handleFolderSelection}>
                                <img src={folderIcon} alt="folder-icon" className="folder-icon" />
                                <span>Select Folder</span>
                            </div>
                        )}
                        {titleFormData.length > 0 && (
                            <>
                                <div className="dropdown-lists">
                                    <div className="select-folder-titles-type-select">
                                        <label>Type</label>
                                        <select name="type" id="type" className="type-select" value={selectedType} onChange={handleChange}>
                                            {["Select type", "Anime", "Book", "Manga", "Movie", "Series"].map((option, index) => (
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

                        <div className="buttons">
                            <button type="submit" className="add-titles-from-folder-button btn">Add to list</button>
                            {folderSelected ? (
                                <button type="button" className="select-another-button btn" onClick={reselectFolder}>Select another folder</button>
                            ) : (
                                <button type="button" className="see-library-button btn" onClick={() => navigate("/lists")}>See list</button>
                            )}
                        </div>
                        <label className={`${error ? "error" : "success"}`}>{error || success}</label>
                    </div>
                    {folderSelected && (
                        <div className="instruction">
                            Adding <strong>{titleFormData.length}</strong> titles to the <strong>{selectedOtakuList || selectedType || "Unknown"}</strong> list. Duplicates will be removed.
                        </div>
                    )}
                </form>
            </Form>
            {titleFormData.length > 20 && (
                <div className="floating-info">
                    Adding many titles may take some time. Thanks for your patience!
                </div>
            )}
        </div>
    );
};

export default AddTitlesFromFolder;