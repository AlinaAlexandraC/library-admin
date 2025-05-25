import "./AddTitlesManually.css";
import Form from "../Form/Form.js";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import formImage from "../../assets/images/form-vertical.jpg";
import formImageHorizontal from "../../assets/images/form-horizontal.jpg";
import fetchCustomLists from "../../utils/fetchCustomLists.js";
import { fetchData } from "../../services/apiService.js";
import { genreDropdown, typeDropdown } from "../../utils/constants.js";

const AddTitlesManually = () => {
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
    const [userLists, setUserLists] = useState([]);
    const [selectedOtakuList, setSelectedOtakuList] = useState("");
    const [selectedType, setSelectedType] = useState("");
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [duplicateCount, setDuplicateCount] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCustomLists(setUserLists);
    }, []);

    const handleChange = (e) => {
        setTitleFormData({ ...titleFormData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            let targetListId;

            if (selectedOtakuList) {
                const selectedList = userLists.find(list => list.name === selectedOtakuList);

                targetListId = selectedList ? selectedList._id : null;
            } else {
                if (selectedType) {
                    targetListId = selectedType;
                } else {
                    targetListId = "Unknown";
                }
            }

            const response = await fetchData("titles/add", "POST", {
                listId: targetListId,
                titles: [titleFormData],
                selectedType: selectedType,
            });

            if (response.success) {
                const duplicates = response.duplicates?.length || 0;
                setDuplicateCount(duplicates);

                if ((response.title?.length || 0) > 0) {
                    setSuccess("Title added successfully!");
                } else {
                    setSuccess("");
                }
                setTitleFormData({
                    title: "",
                    type: "",
                    genre: "",
                    author: "",
                    numberOfSeasons: "",
                    numberOfEpisodes: "",
                    numberOfChapters: "",
                    status: false,
                });
                setSelectedOtakuList("");
                setSelectedType("");
                setTimeout(() => {
                    setSuccess("");
                    setDuplicateCount(0);
                }, 3000);
            } else {
                setError("Process failed. Try again later");
                setTimeout(() => setError(""), 3000);
            }
        } catch (error) {
            console.error("Error during title submission:", error);
            setError(error.message || "Process failed. Try again later");
            setTimeout(() => setError(""), 3000);
        }
    };

    return (
        <div className="add-titles-manually-container">
            <Form formImage={formImage} formImageHorizontal={formImageHorizontal}>
                <form className="add-titles-manually-wrapper" onSubmit={handleSubmit} >
                    <div className="add-titles-manually-title">Add a new title here</div>
                    <div className="add-titles-manually-input-container">
                        <div className="title-container">
                            <label>Title*</label>
                            <input type="text" placeholder="ex. The Apothecary Diaries" className="title" required name="title" value={titleFormData.title} onChange={handleChange} />
                        </div>
                        <div className="type-container">
                            <label>Type</label>
                            <select name="type" className="type" value={titleFormData.type} onChange={(e) => { setSelectedType(e.target.value); handleChange(e); }}>
                                {typeDropdown.map((option, index) => (
                                    <option key={index} value={option === "Select type" ? "" : option}>{option}</option>
                                ))}
                            </select>
                        </div>
                        <div className="otaku-list-select">
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
                        {titleFormData.type === "Anime" && (
                            <div className="anime-container">
                                <div className="genre-container">
                                    <label>Genre</label>
                                    <select name="genre" className="genre" value={titleFormData.genre} onChange={handleChange}>
                                        {genreDropdown.map((option, index) => (
                                            <option key={index} value={option}>{option}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="title-length">
                                    <div className="seasons-number">
                                        <div className="seasons-container">
                                            <label>No. of seasons</label>
                                            <input type="number" placeholder="no of seasons" className="seasons-input" name="numberOfSeasons" value={titleFormData.numberOfSeasons} onChange={handleChange} />
                                        </div>
                                    </div>
                                    <div className="episodes-number">
                                        <div className="episodes-container">
                                            <label>No. of episodes</label>
                                            <input type="number" placeholder="no of episodes" className="episodes-input" name="numberOfEpisodes" value={titleFormData.numberOfEpisodes} onChange={handleChange} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {titleFormData.type === "Book" && (
                            <div className="book-container">
                                <label>Author</label>
                                <input type="text" placeholder="ex. Natsu Hyūga" className="author" name="author" value={titleFormData.author} onChange={handleChange} />
                            </div>
                        )}
                        {titleFormData.type === "Manga" && (
                            <div className="manga-container">
                                <label>No. of chapters</label>
                                <input type="number" placeholder="no of chapters" className="chapters-input" name="numberOfChapters" value={titleFormData.numberOfChapters} onChange={handleChange} />
                            </div>
                        )}
                        {titleFormData.type === "Series" && (
                            <div className="title-length">
                                <div className="seasons-number">
                                    <div className="seasons-container">
                                        <label>No. of seasons</label>
                                        <input type="number" placeholder="no of seasons" className="seasons-input" name="numberOfSeasons" value={titleFormData.numberOfSeasons} onChange={handleChange} />
                                    </div>
                                </div>
                                <div className="episodes-number">
                                    <div className="episodes-container">
                                        <label>No. of episodes</label>
                                        <input type="number" placeholder="no of episodes" className="episodes-input" name="numberOfEpisodes" value={titleFormData.numberOfEpisodes} onChange={handleChange} />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <span className="list-instruction">
                        Titles will be added to:{" "}
                        <strong>{selectedOtakuList || (titleFormData.type ? titleFormData.type : "Unknown")}</strong> list.
                    </span>
                    <div className="buttons">
                        <button type="submit" className="add-titles-manually-button btn">Add to list</button>
                        <button className="see-library-button btn" onClick={() => navigate("/lists")}>See list</button>
                        <label className={`${error ? "error" : "success"}`}>{error ? error : success}</label>
                    </div>
                </form>
            </Form>
            {duplicateCount > 0 ? (
                <div className="floating-error">
                    {duplicateCount} duplicated {duplicateCount === 1 ? "title was" : "titles were"} skipped.
                </div>
            ) : (
                <div className="floating-error instruction">
                    Only fields marked with * are mandatory. Adding more details will increase filtering. Duplicated titles would be removed.
                </div>
            )}
        </div>
    );
};

export default AddTitlesManually;