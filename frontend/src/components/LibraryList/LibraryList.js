import "./LibraryList.css";
import LibraryPagination from "../LibraryPagination/LibraryPagination";
import { useEffect, useRef, useState } from "react";
import fetchTitles from "../../utils/fetchTitles";
import { useNavigate, useParams } from "react-router";
import Loader from "../Loader/Loader";
import SearchBar from "../SearchBar/SearchBar";
import TitleItem from "../TitleItem/TitleItem";
import EditItem from "../EditItem/EditItem";

const LibraryList = ({ }) => {
    const [titles, setTitles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [searchResults, setSearchResults] = useState([]);
    const [query, setQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(() => {
        return parseInt(localStorage.getItem("libraryCurrentPage")) || 1;
    });
    const [modalItem, setModalItem] = useState(null);

    const containerRef = useRef(null);
    const navigate = useNavigate();

    const { listId } = useParams();

    useEffect(() => {
        fetchTitles(listId, setTitles, setError, setLoading);
    }, [listId]);

    const sortedTitles = titles.sort((a, b) => a.title.localeCompare(b.title));

    useEffect(() => {
        if (query.trim() === "") {
            setSearchResults([]);
        } else {
            const filtered = titles.filter(
                (title) => {
                    const lowerQuery = query.toLowerCase();
                    return (
                        (title.title && title.title.toLowerCase().includes(lowerQuery)) ||
                        (title.author && title.author.toLowerCase().includes(lowerQuery))
                    );
                });

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
                const itemHeight = 100;
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

    const activeList = (query ? searchResults : sortedTitles).filter(Boolean);
    const totalPages = Math.ceil(activeList.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const displayedTitles = activeList.slice(startIndex, startIndex + itemsPerPage);

    const handleSearch = (query) => {
        setQuery(query);
    };

    const openModal = (item) => {
        setModalItem(item);
    };

    const closeModal = () => {
        setModalItem(null);
    };

    return (
        <div className="library-list-container">
            <div className="library-list-wrapper">
                <div className="library-list-name">✨ {listId.toUpperCase()} ✨</div>
                <SearchBar onSearch={handleSearch} />
                {loading ? (
                    <Loader />
                ) : error ? (
                    <p>{error}</p>
                ) : (titles.length === 0) ? (
                    <div className="no-titles">
                        <div>No titles found</div>
                        <button className="no-titles-button btn" onClick={() => navigate("/form")}>Add a title</button>
                    </div>
                ) : (
                    <ul className="library-list-titles" ref={containerRef}>
                        {displayedTitles.map((title, index) => (
                            <li key={index} className={`element-${index}`}>
                                <TitleItem title={title} index={startIndex + index + 1} setTitles={setTitles} openModal={openModal} />
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <LibraryPagination totalPages={totalPages} setCurrentPage={setCurrentPage} currentPage={currentPage} />
            {modalItem && (
                <>
                    <div className="overlay" onClick={closeModal}></div>
                    <EditItem title={modalItem} onClose={closeModal} setTitles={setTitles} />
                </>
            )}
        </div>
    );
};

export default LibraryList;