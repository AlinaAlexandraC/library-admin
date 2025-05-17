import "./LibraryList.css";
import LibraryPagination from "../LibraryPagination/LibraryPagination";
import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import fetchTitles from "../../utils/fetchTitles";
import { useNavigate, useParams } from "react-router";
import Loader from "../Loader/Loader";
import SearchBar from "../SearchBar/SearchBar";
import TitleItem from "../TitleItem/TitleItem";
import EditItem from "../EditItem/EditItem";
import FiltersBar from "../FiltersBar/FiltersBar";
import noTitles from "../../assets/images/no-titles.jpg";
import { fetchData } from "../../services/apiService";

const LEGEND_COLORS = [
    { label: "anime", color: "#FF6B6B" },
    { label: "book", color: "#3F51B5" },
    { label: "manga", color: "#F59E0B" },
    { label: "movie", color: "#3CB371" },
    { label: "series", color: "#00BCD4" },
    { label: "unknown", color: "blue" }
];

const LibraryList = () => {
    const [titles, setTitles] = useState([]);
    const [filteredTitles, setFilteredTitles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [query, setQuery] = useState("");
    const [modalItem, setModalItem] = useState(null);
    const [selectedFilters, setSelectedFilters] = useState({ genre: [], watched: [] });
    const [currentPage, setCurrentPage] = useState(() => {
        return parseInt(localStorage.getItem("libraryCurrentPage")) || 1;
    });
    const itemsPerPage = 10;
    const debounceTimeout = useRef(null);

    const navigate = useNavigate();
    const { listId } = useParams();

    useEffect(() => {
        fetchTitles(listId, setTitles, setError, setLoading);
    }, [listId]);

    useEffect(() => {
        return () => {
            if (debounceTimeout.current) {
                clearTimeout(debounceTimeout.current);
            }
        };
    }, []);

    const sortedTitles = useMemo(() => [...titles].sort((a, b) => a.title.localeCompare(b.title)), [titles]);

    const activeList = useMemo(() => {
        const isFilterActive = selectedFilters.genre.length > 0 || selectedFilters.watched.length > 0;
        const baseList = isFilterActive ? filteredTitles : sortedTitles;

        if (query.trim() === "") return baseList;

        const lowerQuery = query.toLowerCase();
        return baseList.filter((title) =>
            (title.title && title.title.toLowerCase().includes(lowerQuery)) ||
            (title.author && title.author.toLowerCase().includes(lowerQuery))
        );
    }, [filteredTitles, sortedTitles, query, selectedFilters]);

    const totalPages = Math.ceil(activeList.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const displayedTitles = activeList.slice(startIndex, startIndex + itemsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [filteredTitles]);

    useEffect(() => {
        if (query) {
            setCurrentPage(1);
        }
    }, [query]);

    useEffect(() => {
        const newTotalPages = Math.ceil(activeList.length / itemsPerPage);
        if (currentPage > newTotalPages) {
            setCurrentPage(Math.max(newTotalPages, 1));
        }
    }, [activeList.length, itemsPerPage, currentPage]);

    const handleToggleStatus = async (title) => {
        const newStatus = !title.status;
        setTitles((prev) =>
            prev.map((item) =>
                item._id === title._id ? { ...item, status: newStatus } : item
            )
        );

        try {
            await fetchData("titles/update", "PATCH", {
                title_id: title._id,
                updatedData: { status: newStatus },
            });
        } catch (error) {
            console.error("Failed to toggle status:", error);
            setTitles((prev) =>
                prev.map((item) =>
                    item._id === title._id ? { ...item, status: !newStatus } : item
                )
            );
        }
    };

    const handleDeleteTitle = async (title) => {
        try {
            await fetchData("titles/remove", "DELETE", { title_id: title._id });
            setTitles((prevTitles) =>
                prevTitles.filter(item => item && item._id && item._id !== title._id)
            );
        } catch (error) {
            console.error("Failed to delete item:", error);
        }
    };

    useEffect(() => {
        localStorage.setItem("libraryCurrentPage", currentPage);
    }, [currentPage]);

    const handleSearch = useCallback((query) => {
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }

        debounceTimeout.current = setTimeout(() => {
            setQuery(query);
        }, 300);
    }, []);

    const openModal = (item) => {
        setModalItem(item);
    };

    const closeModal = () => {
        setModalItem(null);
    };

    return (
        <div className="library-list-container">
            <FiltersBar
                titles={titles}
                setFilteredTitles={setFilteredTitles}
                selectedFilters={selectedFilters}
                setSelectedFilters={setSelectedFilters}
            />
            <div className="legend">
                {LEGEND_COLORS.map(({ label, color }) => (
                    <div key={label} className="color" style={{ backgroundColor: color }}>{label}</div>
                ))}
            </div>
            <div className="library-list-wrapper">
                <div className="library-list-name">✨ {listId.toUpperCase()} ✨</div>
                {loading ? (
                    <Loader />
                ) : error ? (
                    <p className="error">{error}</p>
                ) : query.trim() !== "" && activeList.length === 0 ? (
                    <div className="no-results">
                        <p>No results found for "{query}"</p>
                    </div>
                ) : (selectedFilters.genre.length > 0 || selectedFilters.watched.length > 0) && activeList.length === 0 ? (
                    <div className="no-results">No titles match your filters.</div>
                ) : titles.length === 0 ? (
                    <>
                        <div className="no-titles">
                            <div>No titles found</div>
                            <img src={noTitles} alt="no-titles" className="no-titles-image" />
                            <button className="no-titles-button btn" onClick={() => navigate("/form")}>Add a title</button>
                        </div>
                    </>
                ) : (
                    <div>
                        <SearchBar onSearch={handleSearch} />
                        <ul className="library-list-titles" >
                            {displayedTitles.map((title, index) => (
                                <li key={title._id || index} className={`element-${index}`}>
                                    <TitleItem
                                        title={title}
                                        index={startIndex + index + 1}
                                        setTitles={setTitles}
                                        openModal={openModal}
                                        onToggleStatus={handleToggleStatus}
                                        onDelete={handleDeleteTitle}
                                    />
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