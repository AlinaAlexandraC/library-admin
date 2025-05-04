import "./FiltersBar.css";
import arrowDownIconB from "../../assets/icons/arrow-down-black.svg";
import resetIcon from "../../assets/icons/reset.svg";
import { useRef, useState, useEffect } from "react";

const FiltersBar = ({ titles, setFilteredTitles }) => {
    const [openFilter, setOpenFilter] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState({
        genre: [],
        watched: [],
    });

    const genreArrowRef = useRef(null);
    const statusArrowRef = useRef(null);

    const toggleOptions = (filter) => {
        setOpenFilter(openFilter === filter ? null : filter);
    };

    const rotateArrow = (arrowRef) => {
        if (arrowRef.current) {
            arrowRef.current.classList.toggle("flipped");
        }
    };

    const handleCheckboxChange = (filter, value) => {
        setSelectedFilters((prevFilters) => {
            const newFilters = { ...prevFilters };
            if (newFilters[filter].includes(value)) {
                newFilters[filter] = newFilters[filter].filter(item => item !== value);
            } else {
                newFilters[filter].push(value);
            }
            return newFilters;
        });
    };

    useEffect(() => {
        if (!titles || !Array.isArray(titles)) return;

        const { genre, watched } = selectedFilters;

        const filteredTitles = titles.filter((title) => {
            const genreMatches = genre.length === 0 || (title.genre && genre.includes(title.genre));

            let statusMatches = true;

            if (watched.length > 0) {
                if (watched.includes("Checked") && title.status === true) {
                    statusMatches = true;
                } else if (watched.includes("Not Checked") && title.status === false) {
                    statusMatches = true;
                } else {
                    statusMatches = false;
                }
            }

            return genreMatches && statusMatches;
        });

        setFilteredTitles(filteredTitles);
    }, [selectedFilters, titles, setFilteredTitles]);

    const removeFilters = () => {
        setSelectedFilters({
            genre: [],
            watched: []
        });
        setOpenFilter(null);
        if (titles && Array.isArray(titles)) {
            setFilteredTitles(titles);
        }
    };

    return (
        <div className="filters-bar-container">
            <div className="filters-bar-wrapper">
                <ul className="filters-bar-options">
                    <li className="filter" onClick={() => {
                        toggleOptions("genre");
                        rotateArrow(genreArrowRef, openFilter !== "genre");
                    }}>
                        <div className="filter-name">Genre</div>
                        <img src={arrowDownIconB} alt="arrow-down" className="arrow-down-icon-black" ref={genreArrowRef} />
                        <div className={`options-box ${openFilter === "genre" ? "show" : ""}`}>
                            <ul>
                                {["Isekai", "Shonen", "Mecha", "Slice of Life", "Romance", "Ecchi"].map((genre, index) => (
                                    <li key={index} className={`option-${index}`}>
                                        <input type="checkbox" className="option-checkbox" checked={selectedFilters.genre.includes(genre)} onChange={() => handleCheckboxChange("genre", genre)} />
                                        <div>{genre}</div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </li>
                    <li className="filter" onClick={() => {
                        toggleOptions("status");
                        rotateArrow(statusArrowRef, openFilter !== "status");
                    }}>
                        <div className="filter-name">Status</div>
                        <img src={arrowDownIconB} alt="arrow-down" className="arrow-down-icon-black" ref={statusArrowRef} />
                        <div className={`options-box ${openFilter === "status" ? "show" : ""}`}>
                            <ul>
                                {["Checked", "Not Checked"].map((status, index) => (
                                    <li key={index} className={`option-${index}`}>
                                        <input
                                            type="checkbox"
                                            className="option-checkbox"
                                            checked={selectedFilters.watched.includes(status)}
                                            onChange={() => handleCheckboxChange("watched", status)}
                                        />
                                        <div>{status}</div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </li>
                </ul>
                <div className="filter-reset" onClick={removeFilters}>
                    <div>Reset filters</div>
                    <img src={resetIcon} alt="reset-icon" className="reset-icon" />
                </div>
            </div>
        </div >
    );
};

export default FiltersBar;