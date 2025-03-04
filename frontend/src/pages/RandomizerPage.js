import FiltersBar from "../components/FiltersBar/FiltersBar";
import Randomizer from "../components/Randomizer/Randomizer";
import { useState } from "react";

const RandomizerPage = () => {
    const [selectedFilters, setSelectedFilters] = useState({
        type: [],
        genre: [],
        watched: [],
    });

    return (
        <div className="randomizer-page-container">
            <FiltersBar selectedFilters={selectedFilters} setSelectedFilters={setSelectedFilters} />
            <Randomizer selectedFilters={selectedFilters} />
        </div>
    );
};

export default RandomizerPage;