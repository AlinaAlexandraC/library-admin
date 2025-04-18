import LibraryList from "../components/LibraryList/LibraryList";
import FiltersBar from "../components/FiltersBar/FiltersBar";
import { useState } from "react";

const LibraryPage = () => { 
    const [selectedFilters, setSelectedFilters] = useState({
        type: [],
        genre: [],
        watched: [],
    });

    return (
        <div className="library-page-container">
            <FiltersBar selectedFilters={selectedFilters} setSelectedFilters={setSelectedFilters}/>
            <LibraryList selectedFilters={selectedFilters}/>
        </div>
    );
};

export default LibraryPage;