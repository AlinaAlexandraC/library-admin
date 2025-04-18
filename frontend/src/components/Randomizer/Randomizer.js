import { useEffect, useState } from "react";
import "./Randomizer.css";
import getIcon from "../../utils/getIcon";
import fetchTitles from "../../utils/fetchTitles";
import Loader from "../Loader/Loader";

const Randomizer = ({ selectedFilters }) => {
    const [titles, setTitles] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const iconDefault = getIcon("defaultType");
    const [icon, setIcon] = useState(iconDefault);
    const [header, setHeader] = useState("You should watch this:");
    const [random, setRandom] = useState(null);

    useEffect(() => {
        fetchTitles("Unknown", setTitles, setError, setLoading);
    }, []);

    const randomizeTitle = () => {
        const random = titles.length > 0 ? Math.floor(Math.random() * titles.length) : 0;
        setRandom(random);
    };

    useEffect(() => {
        if (titles.length > 0 && random !== null) {
            const randomTitle = titles[random];
            if (randomTitle) {
                const titleType = randomTitle.type || "defaultType";
                setIcon(getIcon(titleType));
                setHeader(randomTitle.type === 'book' || randomTitle.type === 'manga' ? "You should read this:" : "You should watch this:");
            }
        }
    }, [random, titles]);

    return (
        <div className="randomizer-outer-container">
            <div className="randomizer-inner-container">
                <div className="randomizer-wrapper">
                    <div className="randomizer-display">
                        <span>{header}</span>
                        {titles.length > 0 && (
                            <div className="title-info-randomizer">
                                <img src={icon} alt="icon" className="randomizer-icon" />
                                <div className="title">{titles[random]?.title || "-"}</div>
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
                            <div key={index} className="randomizer-title-container">
                                <div className="decoration"></div>
                                <div className={`randomizer-element-${index}`}>
                                    <span className="element-index">{index + 1}.</span>
                                    <span>{title.title}</span>
                                </div>
                            </div>
                        )))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Randomizer;