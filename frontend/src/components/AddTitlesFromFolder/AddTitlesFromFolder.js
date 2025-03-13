import Form from "../Form/Form";
import "./AddTitlesFromFolder.css";
import formImage from "../../assets/images/form-vertical.jpg";
import formImageHorizontal from "../../assets/images/form-horizontal.jpg";
import folderIcon from "../../assets/icons/folder.svg";
import { useNavigate } from "react-router";
import { useState } from "react";


const AddTitlesFromFolder = () => {
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [folderSelected, setFolderSelected] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = () => {
        console.log("working");
    };

    return (
        <div className="add-titles-from-folder-container">
            <Form formImage={formImage} formImageHorizontal={formImageHorizontal}>
                <form className="add-titles-from-folder-wrapper" onSubmit={handleSubmit}>
                    <div className="add-titles-from-folder-title">Import titles from a folder</div>
                    {
                        folderSelected ? (
                            <div className="titles-list-from-folder">
                                <ul>
                                    <li>
                                        <div>title</div>
                                        <button>x</button>
                                    </li>
                                    <li>
                                        <div>title</div>
                                        <button>x</button>
                                    </li>
                                </ul>
                            </div>
                        ) : (
                            <div className="select-folder-container" onClick={() => setFolderSelected(!folderSelected)}>
                                <img src={folderIcon} alt="folder-icon" className="folder-icon" />
                                <label>Select Folder</label>
                            </div>
                        )
                    }
                    <div className="buttons-container">
                        <div className="buttons">
                            <button type="submit" className="add-titles-manually-button btn">Add to list</button>
                            <button className="see-library-button btn" onClick={() => navigate("/library")}>See list</button>
                        </div>
                        <label className={`${error ? "error" : "success"}`}>{error ? error : success}</label>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default AddTitlesFromFolder;