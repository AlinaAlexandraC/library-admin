import { useEffect, useState } from "react";
import "./Randomizer.css";
import getIcon from "../../utils/getIcon";
import Loader from "../Loader/Loader";
import { fetchData } from "../../services/apiService";
import fetchCustomLists from "../../utils/fetchCustomLists";
import { reservedNames } from "../../utils/constants";

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
    const [customLoading, setCustomLoading] = useState(true);
    const [defaultLoading, setDefaultLoading] = useState(true);
    const loading = customLoading || defaultLoading;

    useEffect(() => {
        const getLists = async () => {
            const handleSetCustomLists = (lists) => {
                const nonEmptyLists = lists.filter(list => list.titles && list.titles.length > 1);
                setCustomLists(nonEmptyLists);
                setCustomLoading(false);
            };

            await fetchCustomLists(handleSetCustomLists);
        };

        getLists();

        const fetchDefaultLists = async () => {
            try {
                const data = await fetchData("lists");
                const defaults = data.filter(list => reservedNames.includes(list.name) && list.titles.length > 1);
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

        if (selectedListName) {
            try {
                const allLists = [...customLists, ...defaultLists];
                const selectedList = allLists.find(list => list.name === selectedListName);
                const fetchedTitles = selectedList ? selectedList.titles : [];

                setTitles(fetchedTitles);
                setIsListSelected(true);
                setCustomLoading(false);
                setDefaultLoading(false);
                setRandom(null);
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
            const rawType = randomTitle?.title_id?.type || randomTitle?.type;

            if (!rawType || rawType === "") {
                setHeader("This is the chosen title:");
                setIcon(getIcon("Unknown"));
                return;
            }

            const titleType = rawType;
            setIcon(getIcon(titleType));

            const readingTypes = ['Book', 'Manga'];
            setHeader(readingTypes.includes(titleType) ? "You should read this:" : "You should watch this:");
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
                                    <div className="randomizer-title">Select a list</div>
                                    <hr />
                                    <select name="" onChange={handleListSelection} disabled={customLists.length === 0}>
                                        <option value="">Select a custom list</option>
                                        {customLists.map(list => (
                                            <option key={list._id} value={list.name}>
                                                {list.name}
                                            </option>
                                        ))}
                                    </select>
                                    <>
                                        <div className="">OR</div>
                                    </>
                                    <select onChange={handleListSelection} disabled={defaultLists.length === 0}>
                                        <option value="">Select a default list</option>
                                        {defaultLists.map(list => (
                                            <option key={list._id} value={list.name}>{['Series', 'Unknown'].includes(list.name) ? list.name : `${list.name}s`}
                                            </option>
                                        ))}
                                    </select>
                                    <hr />
                                </>
                            )}
                        </div>
                    ) : (
                        <>
                            <div className="randomizer-display">
                                <span className="randomizer-display-header">{header}</span>
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
                            </div>
                            <div className="select-another-list btn" onClick={() => setIsListSelected(!isListSelected)}>
                                Select another list
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Randomizer;