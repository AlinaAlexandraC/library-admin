import "./AddTitlesManually.css";
import Form from "../Form/Form.js";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import formImage from "../../assets/images/form-vertical.jpg";
import formImageHorizontal from "../../assets/images/form-horizontal.jpg";
import fetchCustomLists from "../../utils/fetchCustomLists.js";
import { fetchData } from "../../services/apiService.js";

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
                setSuccess("Title added successfully!");
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
                setTimeout(() => setSuccess(""), 2000);
            } else {
                setError("Process failed. Try again later");
                setTimeout(() => setError(""), 2000);
            }
        } catch (error) {
            console.error("Error during title submission:", error);
            setError(error.message || "Process failed. Try again later");
            setTimeout(() => setError(""), 2000);
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
                                {["Select type", "Anime", "Book", "Manga", "Movie", "Series"].map((option, index) => (
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
                                        {["Select genre", "Isekai", "Shonen", "Mecha", "Slice of Life", "Romance", "Ecchi"].map((option, index) => (
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
                    <div className="buttons-container">
                        <div className="buttons">
                            <button type="submit" className="add-titles-manually-button btn">Add to list</button>
                            <button className="see-library-button btn" onClick={() => navigate("/lists")}>See list</button>
                        </div>
                        <label className={`${error ? "error" : "success"}`}>{error ? error : success}</label>
                    </div>
                </form>
                <p className="list-instruction">
                    Titles will be added to:{" "}
                    <strong>{selectedOtakuList || (titleFormData.type ? titleFormData.type : "Unknown")}</strong> list
                </p>
                <div className="instruction">Only fields marked with * are mandatory. Adding more details will increase filtering.</div>
            </Form>
        </div>
    );
};

export default AddTitlesManually;