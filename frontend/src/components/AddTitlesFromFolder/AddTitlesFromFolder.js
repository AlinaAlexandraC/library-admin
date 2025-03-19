import Form from "../Form/Form";
import "./AddTitlesFromFolder.css";
import formImage from "../../assets/images/form-vertical.jpg";
import formImageHorizontal from "../../assets/images/form-horizontal.jpg";
import folderIcon from "../../assets/icons/folder.svg";
import { useNavigate } from "react-router";
import { useState } from "react";
import { addTitle } from "../../services/titleService";


const AddTitlesFromFolder = () => {
    const [titleFormData, setTitleFormData] = useState({
        title: "",
        type: "",
        genre: "",
        author: "",
        numberOfSeasons: "",
        numberOfEpisodes: "",
        numberOfChapters: "",
        status: false,
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [folderSelected, setFolderSelected] = useState(false);
    const navigate = useNavigate();

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
            }, 2000);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (titleFormData.length === 0) {
            setError("No titles to add. Please select a valid folder.");
            setTimeout(() => {
                setError(null);
            }, 2000);
            return;
        }

        try {
            const titles = titleFormData.map(title => ({
                title: title,
                type: "",
                genre: "",
                author: "",
                numberOfSeasons: "",
                numberOfEpisodes: "",
                numberOfChapters: "",
                status: false,
            }));

            const response = await addTitle({ titles });

            if (response.success) {
                setSuccess("Titles added successfully!");
                setTimeout(() => {
                    setSuccess("");
                }, 2000);

                setTitleFormData([]);
                setFolderSelected(false);
            } else {
                setError("Error adding titles. Try again later.");
                setTimeout(() => {
                    setError(null);
                }, 2000);
            }
        } catch (error) {
            setError("Failed to connect to server");
            setTimeout(() => {
                setError(null);
            }, 2000);
        }
    };

    return (
        <div className="add-titles-from-folder-container">
            <Form formImage={formImage} formImageHorizontal={formImageHorizontal}>
                <form className="add-titles-from-folder-wrapper" onSubmit={handleSubmit} >
                    <div className="add-titles-from-folder-title">Import titles from a folder</div>
                    {!folderSelected && (
                        <div className="select-folder-container" onClick={handleFolderSelection}>
                            <img src={folderIcon} alt="folder-icon" className="folder-icon" />
                            <span>Select Folder</span>
                        </div>
                    )}
                    {titleFormData.length > 0 && (
                        <div className="titles-list-from-folder">
                            <ul>
                                {titleFormData.map((title, index) => (
                                    <li key={index} className="extracted-title-container">
                                        <div className="decoration"></div>
                                        <div className="extracted-title">{index + 1}. {title}</div>
                                        <button type="button" onClick={() => setTitleFormData(titleFormData.filter((_, i) => i !== index))} className="extracted-title-button">x</button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <div className="buttons-container">
                        <div className="buttons">
                            <button type="submit" className="add-titles-manually-button btn">Add to list</button>
                            <button type="button" className="see-library-button btn" onClick={() => navigate("/library")}>See list</button>
                        </div>
                        <label className={`${error ? "error" : "success"}`}>{error || success}</label>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default AddTitlesFromFolder;