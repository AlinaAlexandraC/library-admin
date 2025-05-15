import "./FiltersBar.css";
import arrowDownIconB from "../../assets/icons/arrow-down-black.svg";
import resetIcon from "../../assets/icons/reset.svg";
import { useState, useEffect } from "react";

const FiltersBar = ({ titles, setFilteredTitles }) => {
    const [openFilter, setOpenFilter] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState({
        genre: [],
        watched: [],
    });

    const toggleOptions = (filter) => {
        setOpenFilter(openFilter === filter ? null : filter);
    };

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

        const filterBooleans = watched.map(status =>
            status === "Checked" ? true : false
        );

        const filteredTitles = titles.filter((title) => {
            const genreMatches =
                genre.length === 0 || (title.genre && genre.includes(title.genre));

            const statusMatches =
                filterBooleans.length === 0 || filterBooleans.includes(title.status);

            return genreMatches && statusMatches;
        });

        setFilteredTitles(filteredTitles);
    }, [selectedFilters, titles, setFilteredTitles]);


    const removeFilters = () => {
        setSelectedFilters({ genre: [], watched: [] });
        setOpenFilter(null);
        setFilteredTitles(titles);
    };

    const genres = ["Isekai", "Shonen", "Mecha", "Slice of Life", "Romance", "Ecchi"];
    const statuses = ["Checked", "Not Checked"];

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
                        <div className={`options-box ${openFilter === "genre" ? "show" : ""}`}>
                            <ul>
                                {genres.map((genre, index) => (
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
                        <div className={`options-box ${openFilter === "status" ? "show" : ""}`}>
                            <ul>
                                {statuses.map((status, index) => (
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