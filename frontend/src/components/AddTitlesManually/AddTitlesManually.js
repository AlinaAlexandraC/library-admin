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
    const [floatingMessage, setFloatingMessage] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCustomLists(setUserLists);
    }, []);

    const handleChange = (e) => {
        setTitleFormData({ ...titleFormData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFloatingMessage({ type: "info", text: "Adding title, please wait..." });

        try {
            let targetListId;

            if (selectedOtakuList) {
                const selectedList = userLists.find(list => list.name === selectedOtakuList);
                targetListId = selectedList ? selectedList._id : null;
            } else {
                targetListId = selectedType || "Unknown";
            }

            const response = await fetchData("titles/add", "POST", {
                listId: targetListId,
                titles: [titleFormData],
                selectedType: selectedType,
            });

            if (response.success) {
                setFloatingMessage({
                    type: "success",
                    text: `${response.message}`,
                });
                setTimeout(() => setFloatingMessage(null), 3000);

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
            } else {
                setFloatingMessage({ type: "error", text: "Process failed. Try again later" });
                setTimeout(() => setFloatingMessage(null), 3000);
            }
        } catch (error) {
            console.error("Error during title submission:", error);
            setFloatingMessage({ type: "error", text: error.message || "Process failed. Try again later" });
            setTimeout(() => setFloatingMessage(null), 3000);
        }
    };

    const buttons = [
        {
            label: "Add to list",
            type: "submit",
            className: "add-titles-manually-button btn",
        },
        {
            label: "See list",
            type: "button",
            className: "see-library-button btn",
            onClick: () => navigate("/lists"),
        },
    ];

    return (
        <div className="add-titles-manually-container">
            <Form
                formImage={formImage}
                formImageHorizontal={formImageHorizontal}
                header="Add a new title here"
                floatingMessage={floatingMessage && floatingMessage.text ? floatingMessage : null}
                onSubmit={handleSubmit}
                instruction={
                    <>
                        <span >
                            Titles will be added to:{" "}
                            <strong>{selectedOtakuList || (titleFormData.type ? titleFormData.type : "Unknown")}</strong> list.
                        </span>
                        <br />
                        <br />
                        <span >
                            Only * fields are mandatory.
                        </span>
                        <br />
                        <span >
                            Adding more details will increase filtering.
                        </span>
                    </>
                }
                buttons={buttons}>
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
            </Form>
        </div>
    );
};

export default AddTitlesManually;