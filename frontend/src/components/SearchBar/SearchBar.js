import { useState } from "react";
import "./SearchBar.css";

const SearchBar = ({ onSearch }) => {
    const [query, setQuery] = useState("");

    const handleChange = (event) => {        
        setQuery(event.target.value);
        onSearch(event.target.value);
    };

    return (
        <div className="search-bar-container">
            <input type="text" className="search-bar-input" placeholder="Search..." value={query} onChange={handleChange} />
        </div>
    );
};

export default SearchBar;