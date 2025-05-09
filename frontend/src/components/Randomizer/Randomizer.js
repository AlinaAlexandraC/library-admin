import { useEffect, useState } from "react";
import "./Randomizer.css";
import getIcon from "../../utils/getIcon";
import Loader from "../Loader/Loader";
import { fetchData } from "../../services/apiService";
import fetchCustomLists from "../../utils/fetchCustomLists";

const Randomizer = () => {
    const [titles, setTitles] = useState([]);
    const [error, setError] = useState(null);
    const iconDefault = getIcon("defaultType");
    const [icon, setIcon] = useState(iconDefault);
    const [header, setHeader] = useState("This is the chosen title:");
    const [random, setRandom] = useState(null);
    const [isListSelected, setIsListSelected] = useState(false);
    const [customLists, setCustomLists] = useState([]);
    const [defaultLists, setDefaultLists] = useState([]);
    const [selectedList, setSelectedList] = useState("");
    const [customLoading, setCustomLoading] = useState(true);
    const [defaultLoading, setDefaultLoading] = useState(true);
    const loading = customLoading || defaultLoading;

    useEffect(() => {
        const getLists = async () => {
            const handleSetCustomLists = (lists) => {
                const nonEmptyLists = lists.filter(list => list.titles && list.titles.length > 0);
                setCustomLists(nonEmptyLists);
                setCustomLoading(false);
            };

            await fetchCustomLists(handleSetCustomLists);
        };

        getLists();

        const fetchDefaultLists = async () => {
            const defaultListNames = ["Anime", "Movie", "Manga", "Series", "Book", "Unknown"];
            try {
                const data = await fetchData("lists");
                const defaults = data.filter(list => defaultListNames.includes(list.name) && list.titles.length > 0);
                setDefaultLists(defaults);
            } catch (error) {
                console.error("Failed to fetch the default lists", error);
            } finally {
                setDefaultLoading(false);
            }
        };

        fetchDefaultLists();
    }, []);

    const handleListSelection = async (event) => {
        const selectedListName = event.target.value;
        setSelectedList(selectedListName);
        setCustomLoading(false);
        setDefaultLoading(false);

        if (selectedListName) {
            try {
                const allLists = [...customLists, ...defaultLists];
                const selectedList = allLists.find(list => list.name === selectedListName);
                const fetchedTitles = selectedList ? selectedList.titles : [];

                setTitles(fetchedTitles);
                setIsListSelected(true);
                setCustomLoading(false);
                setDefaultLoading(false);
            } catch (error) {
                setError("Failed to fetch titles for the selected list.");
                setTimeout(() => setError(""), 3000);
                setCustomLoading(false);
                setDefaultLoading(false);
            }
        }
    };

    const randomizeTitle = () => {
        const random = titles.length > 0 ? Math.floor(Math.random() * titles.length) : 0;
        setRandom(random);
    };

    useEffect(() => {
        if (titles.length > 0 && random !== null) {
            const randomTitle = titles[random];

            if (randomTitle && randomTitle.title_id) {
                const titleType = randomTitle.type || "defaultType";
                setIcon(getIcon(titleType));

                if (randomTitle.type === 'book' || randomTitle.type === 'manga') {
                    setHeader("You should read this:");
                } else {
                    setHeader("You should watch this:");
                }
            } else {
                setHeader("This is the chosen title:");
            }
        }
    }, [random, titles]);

    return (
        <div className="randomizer-outer-container">
            <div className="randomizer-inner-container">
                <div className="randomizer-wrapper">
                    {!isListSelected ? (
                        <div className="randomizer-list-selection">
                            {loading ? (
                                <Loader />
                            ) : error ? (
                                <p>{error}</p>
                            ) : (
                                <>
                                    <select name="" onChange={handleListSelection}>
                                        <option value="">Select a custom list</option>
                                        {customLists.map(list => (
                                            <option key={list._id} value={list.name}>
                                                {list.name}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="">OR</div>
                                    <select onChange={handleListSelection}>
                                        <option value="">Select a default list</option>
                                        {defaultLists.map(list => (
                                            <option key={list._id} value={list.name}>{['Series', 'Unknown'].includes(list.name) ? list.name : `${list.name}s`}
                                            </option>
                                        ))}
                                    </select>
                                </>
                            )}
                        </div>
                    ) : (
                        <>
                            <div className="randomizer-display">
                                <span>{header}</span>
                                {titles.length > 0 && (
                                    <div className="title-info-randomizer">
                                        <img src={icon} alt="icon" className="randomizer-icon" />
                                        <div className="title">{titles[random]?.title_id.title || "-"}</div>
                                    </div>
                                )}
                                <button onClick={randomizeTitle} className="random btn">Get Random Title</button>
                            </div>
                            <hr />
                            <div className="randomizer-titles-list">
                                {loading ? (
                                    <Loader />
                                ) : error ? (
                                    <p>{error}</p>
                                ) : (titles.map((title, index) => (
                                    <div key={title._id || index} className="randomizer-title-container">
                                        <div className="decoration"></div>
                                        <div className={`randomizer-element-${index}`}>
                                            <div className="element-index">{index + 1}.</div>
                                            <span>{title?.title_id?.title || "Untitled"}</span>
                                        </div>
                                    </div>
                                )))}
                                <div className="select-another-list btn" onClick={() => setIsListSelected(!isListSelected)}>
                                    Select another list
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Randomizer;