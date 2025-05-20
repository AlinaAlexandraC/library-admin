import { useState } from "react";
import "./SearchBar.css";

const SearchBar = ({ onSearch }) => {
    const [query, setQuery] = useState("");

    const handleChange = (event) => {
        setQuery(event.target.value);
        onSearch(event.target.value);
    };

    const handleClear = () => {
        setQuery("");
        onSearch("");
    };

    return (
        <div className="search-bar-container">
            <input type="text" className="search-bar-input" placeholder="Search..." value={query} onChange={handleChange} />
            {query && (
                <div className="clear-button" onClick={handleClear} aria-label="Clear search">
                    ×
                </div>
            )}
        </div>
    );
};

export default SearchBar;