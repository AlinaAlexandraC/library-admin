import "./LibraryList.css";
import LibraryItem from "../LibraryItem/LibraryItem";
import LibraryPagination from "../LibraryPagination/LibraryPagination";
import { useEffect, useRef, useState } from "react";
import fetchTitles from "../../utils/fetchTitles";
import { useNavigate } from "react-router";
import { editTitle } from "../../services/titleService";
import Loader from "../Loader/Loader";
import SearchBar from "../SearchBar/SearchBar";
import AnimeItem from "../AnimeItem/AnimeItem";

const LibraryList = () => {
    const [titles, setTitles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [searchResults, setSearchResults] = useState([]);
    const [query, setQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(() => {
        return parseInt(localStorage.getItem("libraryCurrentPage")) || 1;
    });

    const containerRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchTitles(setTitles, setError, setLoading);
    }, []);

    useEffect(() => {
        if (query.trim() === "") {
            setSearchResults([]);
        } else {
            const filtered = titles.filter(
                (title) => title.title && title.title.toLowerCase().startsWith(query.toLowerCase())
            );

            setSearchResults(filtered);
        }

        if (query) {
            setCurrentPage(1);
        }
    }, [query, titles]);

    useEffect(() => {
        const calculateItemsPerPage = () => {
            if (containerRef.current) {
                const listHeight = containerRef.current.clientHeight;
                const itemHeight = 61;
                const searchBarHeight = 50;
                const newItemsPerPage = Math.max(1, Math.floor((listHeight - searchBarHeight) / itemHeight));
                setItemsPerPage(newItemsPerPage);
            }
        };

        calculateItemsPerPage();
        window.addEventListener("resize", calculateItemsPerPage);
        return () => window.removeEventListener("resize", calculateItemsPerPage);
    }, [titles]);

    useEffect(() => {
        localStorage.setItem("libraryCurrentPage", currentPage);
    }, [currentPage]);

    const activeList = query ? searchResults : titles;
    const totalPages = Math.ceil(activeList.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const displayedTitles = activeList.slice(startIndex, startIndex + itemsPerPage);

    const handleSearch = (query) => {
        setQuery(query);
    };

    const handleSave = async (editedTitle) => {
        try {
            const response = await editTitle(editedTitle);
            if (!response || response.error) {
                throw new Error("Failed to update title");
            }
            setTitles((prevTitles) =>
                prevTitles.map(title => title.id === editedTitle.id ? editedTitle : title)
            );
        } catch (error) {
            console.error("Failed to save item:", error);
        }
    };

    const onDelete = (id) => {
        setTitles((prevTitles) => prevTitles.filter((title) => title.id !== id));
    };

    return (
        <div className="library-list-container">
            <div className="library-list-wrapper">
                <SearchBar onSearch={handleSearch} />
                <AnimeItem/>
                <AnimeItem/>
                {/* {loading ? (
                    <Loader />
                ) : error ? (
                    <p>{error}</p>
                ) : displayedTitles.length === 0 ? (
                    <div className="no-titles">
                        <div>No titles found</div>
                        <button className="no-titles-button btn" onClick={() => navigate("/form")}>Add a title</button>
                    </div>
                ) : (
                    <ul className="library-list-titles" ref={containerRef}>
                        {displayedTitles.map((title) => (
                            <li key={title.id} className={`element-${title.id}`}>
                                <LibraryItem title={title} onDelete={onDelete} handleSave={handleSave} />
                            </li>
                        ))}
                    </ul>
                )} */}
            </div>
            <LibraryPagination totalPages={totalPages} setCurrentPage={setCurrentPage} currentPage={currentPage} />
        </div>
    );
};

export default LibraryList;