import "./FiltersBar.css";
import arrowDownIconB from "../../assets/icons/arrow-down-black.svg";
import resetIcon from "../../assets/icons/reset.svg";
import { useRef, useState } from "react";

const FiltersBar = ({ selectedFilters, setSelectedFilters }) => {
    const [openFilter, setOpenFilter] = useState(false);
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

    // TODO: fix this part; the filters should be gathered in an array that should be displayed in the new section and only when applyFilters button is clicked, it should be filtered
    // TODO: in the dropdown lists, I should select as many types and only then to have the dropdown closed
    // TODO: if I click on the span next to checkbox, it should mark the box as well
    const applyFilters = () => {
        // const { type, genre, watched } = selectedFilters;

        // const filteredTitles = ["titles"].filter((title) => {

        //     const typeMatches = type.length === 0 || type.includes(title.type);
        //     const genreMatches = genre.length === 0 || genre.includes(title.genre);
        //     const watchedMatches = watched.length === 0 || watched.includes(title.watched);

        //     return typeMatches && genreMatches && watchedMatches;
        // });

        setOpenFilter(null);
    };

    const removeFilters = () => {
        setSelectedFilters({
            type: [],
            genre: [],
            watched: []
        });
        setOpenFilter(null);
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
                                {["Checked", "Not Checked"].map((watched, index) => (
                                    <li key={index} className={`option-${index}`}>
                                        <input type="checkbox" className="option-checkbox" checked={selectedFilters.watched.includes(watched)} onChange={() => handleCheckboxChange("watched", watched)} />
                                        <div>{watched}</div>
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