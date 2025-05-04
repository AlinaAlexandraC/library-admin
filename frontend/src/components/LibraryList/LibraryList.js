import "./LibraryList.css";
import LibraryPagination from "../LibraryPagination/LibraryPagination";
import { useEffect, useRef, useState } from "react";
import fetchTitles from "../../utils/fetchTitles";
import { useNavigate, useParams } from "react-router";
import Loader from "../Loader/Loader";
import SearchBar from "../SearchBar/SearchBar";
import TitleItem from "../TitleItem/TitleItem";
import EditItem from "../EditItem/EditItem";
import FiltersBar from "../FiltersBar/FiltersBar";
import noTitles from "../../assets/images/no-titles.jpg";

const LibraryList = () => {
    const [titles, setTitles] = useState([]);
    const [filteredTitles, setFilteredTitles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchResults, setSearchResults] = useState([]);
    const [query, setQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(() => {
        return parseInt(localStorage.getItem("libraryCurrentPage")) || 1;
    });
    const itemsPerPage = 10;
    const [modalItem, setModalItem] = useState(null);

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
            const lowerQuery = query.toLowerCase();
            const filtered = titles.filter((title) =>
                (title.title && title.title.toLowerCase().includes(lowerQuery)) ||
                (title.author && title.author.toLowerCase().includes(lowerQuery))
            );
            setSearchResults(filtered);
        }

        if (query) {
            setCurrentPage(1);
        }
    }, [query, titles]);

    useEffect(() => {
        localStorage.setItem("libraryCurrentPage", currentPage);
    }, [currentPage]);

    const activeList = searchResults.length > 0 ? searchResults : filteredTitles.length > 0 ? filteredTitles : sortedTitles;
    const totalPages = Math.ceil(activeList.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const displayedTitles = activeList.slice(startIndex, startIndex + itemsPerPage);

    useEffect(() => {
        const newTotalPages = Math.ceil(activeList.length / itemsPerPage);
        if (currentPage > newTotalPages) {
            setCurrentPage(Math.max(newTotalPages, 1));
        }
    }, [activeList.length, itemsPerPage, currentPage]);

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
            <FiltersBar titles={titles} setFilteredTitles={setFilteredTitles} />
            <div className="library-list-wrapper">
                <div className="library-list-name">✨ {listId.toUpperCase()} ✨</div>
                {loading ? (
                    <Loader />
                ) : (titles.length === 0) ? (
                    <div className="no-titles">
                        <div>No titles found</div>
                        <img src={noTitles} alt="no-titles" className="no-titles-image" />
                        <button className="no-titles-button btn" onClick={() => navigate("/form")}>Add a title</button>
                    </div>
                ) : error ? (
                    <p>{error}</p>
                ) : (
                    <div>
                        <SearchBar onSearch={handleSearch} />
                        <ul className="library-list-titles" >
                            {displayedTitles.map((title, index) => (
                                <li key={index} className={`element-${index}`}>
                                    <TitleItem title={title} index={startIndex + index + 1} setTitles={setTitles} openModal={openModal} />
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
            <LibraryPagination
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
            />
            {modalItem && (
                <>
                    <div className="overlay" onClick={closeModal}></div>
                    <EditItem title={modalItem} onClose={closeModal} setTitles={setTitles} refreshTitles={() => fetchTitles(listId, setTitles, setError, setLoading)} />
                </>
            )}
        </div>
    );
};

export default LibraryList;