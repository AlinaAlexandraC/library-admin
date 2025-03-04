import "./AddToLibrary.css";
import Form from "../Form/Form";
import { useState } from "react";
import { addTitle } from "../../services/titleService.js";
import { useNavigate } from "react-router";
import formImage from "../../assets/images/form-vertical.jpg";
import formImageHorizontal from "../../assets/images/form-horizontal.jpg";

const AddToLibrary = () => {
    const [titleFormData, setTitleFormData] = useState({
        title: "",
        author: "",
        type: "",
        genre: "",
        no_of_seasons: "",
        no_of_episodes: ""
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setTitleFormData({ ...titleFormData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await addTitle(titleFormData);

            if (response.success) {
                setSuccess(response.message);
                setTitleFormData({
                    title: "",
                    author: "",
                    type: "",
                    genre: "",
                    no_of_seasons: "",
                    no_of_episodes: ""
                });
                setTimeout(() => setSuccess(""), 2000);
            } else {
                setError("Process failed. Try again later");
                setTimeout(() => setError(""), 2000);
            }
        } catch (error) {
            setError(error.message || "Process failed. Try again later");
            setTimeout(() => setError(""), 2000);
        }
    };

    return (
        <div className="add-to-library-container">
            <Form formImage={formImage} formImageHorizontal={formImageHorizontal}>
                <form className="add-to-library-wrapper" onSubmit={handleSubmit}>
                    <div className="add-to-library-title">Add a new title here</div>
                    <div className="add-to-library-input-container">
                        <div className="title-container">
                            <label>Title*</label>
                            <input type="text" placeholder="ex. The Apothecary Diaries" className="title" required name="title" value={titleFormData.title} onChange={handleChange} />
                        </div>
                        <div className="type-container">
                            <label>Type</label>
                            <select name="type" className="type" value={titleFormData.type} onChange={handleChange}>
                                {["Select type", "Anime", "Book", "Manga", "Movie", "Series"].map((option, index) => (
                                    <option key={index} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                        {titleFormData.type === "Anime" && (
                            <div className="anime-container">
                                <div className="genre-container">
                                    <label>Genre</label>
                                    <select name="genre" className="genre" value={titleFormData.genre} onChange={handleChange}>
                                        {["Select genre", "Isekai", "Shonen", "Mecha", "Slice of Life", "Romance", "Ecchi", "Other"].map((option, index) => (
                                            <option key={index} value={option}>{option}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="title-length">
                                    <div className="seasons-number">
                                        <div className="seasons-container">
                                            <label>No. of seasons</label>
                                            <input type="number" placeholder="no. of seasons" className="seasons-input" name="no_of_seasons" value={titleFormData.no_of_seasons} onChange={handleChange} />
                                        </div>
                                    </div>
                                    <div className="episodes-number">
                                        <div className="episodes-container">
                                            <label>No. of episodes</label>
                                            <input type="number" placeholder="no. of episodes" className="episodes-input" name="no_of_pages" value={titleFormData.no_of_pages} onChange={handleChange} />
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
                                <input type="number" placeholder="no. of chapters" className="chapters-input" name="no_of_pages" value={titleFormData.no_of_pages} onChange={handleChange} />
                            </div>
                        )}
                        {titleFormData.type === "Series" && (
                            <div className="title-length">
                                <div className="seasons-number">
                                    <div className="seasons-container">
                                        <label>No. of seasons</label>
                                        <input type="number" placeholder="no. of seasons" className="seasons-input" name="no_of_seasons" value={titleFormData.no_of_seasons} onChange={handleChange} />
                                    </div>
                                </div>
                                <div className="episodes-number">
                                    <div className="episodes-container">
                                        <label>No. of episodes</label>
                                        <input type="number" placeholder="no. of episodes" className="episodes-input" name="no_of_pages" value={titleFormData.no_of_pages} onChange={handleChange} />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="buttons-container">
                        <div className="buttons">
                            <button type="submit" className="add-to-library-button btn">Add to list</button>
                            <button className="see-library-button btn" onClick={() => navigate("/library")}>See list</button>
                        </div>
                        <label className={`${error ? "error" : "success"}`}>{error ? error : success}</label>
                    </div>
                </form>
                <div className="instruction">Only fields marked with * are mandatory. Adding more details will increase filtering.</div>
            </Form>
        </div>
    );
};

export default AddToLibrary;