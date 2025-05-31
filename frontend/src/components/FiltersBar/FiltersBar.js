import "./FiltersBar.css";
import arrowDownIconB from "../../assets/icons/arrow-down-black.svg";
import resetIcon from "../../assets/icons/reset.svg";
import { useState, useEffect, useRef } from "react";
import { genresFilters, statusesFilters } from "../../utils/constants";

const FiltersBar = ({ titles, setFilteredTitles, selectedFilters, setSelectedFilters }) => {
    const [openFilter, setOpenFilter] = useState(false);
    const genreRef = useRef(null);
    const statusRef = useRef(null);

    const toggleOptions = (filter) => {
        setOpenFilter(openFilter === filter ? null : filter);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!openFilter) return;

            let refToCheck = null;
            if (openFilter === "genre") refToCheck = genreRef;
            else if (openFilter === "status") refToCheck = statusRef;

            if (refToCheck && refToCheck.current && !refToCheck.current.contains(event.target)) {
                setOpenFilter(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [openFilter]);

    const handleCheckboxChange = (filter, value) => {
        setSelectedFilters((prev) => {
            const updated = [...prev[filter]];
            const index = updated.indexOf(value);
            if (index > -1) {
                updated.splice(index, 1);
            } else {
                updated.push(value);
            }

            return { ...prev, [filter]: updated };
        });
    };

    useEffect(() => {
        if (!titles || !Array.isArray(titles)) return;

        const { genre, watched } = selectedFilters;

        const filteredTitles = titles.filter((title) => {
            const genreMatches =
                genre.length === 0 || (title.genre && genre.includes(title.genre));

            const statusLabel = title.status ? "Checked" : "Not Checked";

            const statusMatches =
                watched.length === 0 || watched.includes(statusLabel);

            return genreMatches && statusMatches;
        });

        setFilteredTitles(filteredTitles);
    }, [selectedFilters, titles, setFilteredTitles]);

    const removeFilters = () => {
        setSelectedFilters({ genre: [], watched: [] });
        setOpenFilter(null);
        setFilteredTitles(titles);
    };

    return (
        <div className="filters-bar-container">
            <div className="filters-bar-wrapper">
                <ul className="filters-bar-options">
                    <li className="filter" onClick={() => toggleOptions("genre")}>
                        <div className="filter-name">Genre</div>
                        <img
                            src={arrowDownIconB}
                            alt="arrow"
                            className={`arrow-down-icon-black ${openFilter === "genre" ? "flipped" : ""}`}
                        />
                        <div ref={genreRef} className={`options-box ${openFilter === "genre" ? "show" : ""}`}>
                            <ul>
                                {genresFilters.map((genre, index) => (
                                    <li key={index} className={`option-${index}`}>
                                        <input type="checkbox" className="option-checkbox" checked={selectedFilters.genre.includes(genre)} onChange={() => handleCheckboxChange("genre", genre)} />
                                        <div>{genre}</div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </li>
                    <li className="filter" onClick={() => toggleOptions("status")}>
                        <div className="filter-name">Status</div>
                        <img
                            src={arrowDownIconB}
                            alt="arrow"
                            className={`arrow-down-icon-black ${openFilter === "status" ? "flipped" : ""}`}
                        />
                        <div ref={statusRef} className={`options-box ${openFilter === "status" ? "show" : ""}`}>
                            <ul>
                                {statusesFilters.map((status, index) => (
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
                    <span>Reset filters</span>
                    <img src={resetIcon} alt="reset-icon" className="reset-icon" />
                </div>
            </div>
        </div >
    );
};

export default FiltersBar;