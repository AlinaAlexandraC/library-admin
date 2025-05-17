import './OtakuLists.css';
import { useEffect, useState, useMemo } from 'react';
import AddListModal from '../AddListModal/AddListModal';
import noListIcon from '../../assets/images/no-lists.jpg';
import ListItem from '../ListItem/ListItem';
import icon from '../../assets/icons/manga.svg';
import { fetchData } from '../../services/apiService';
import LibraryPagination from '../LibraryPagination/LibraryPagination';
import { Link } from 'react-router';
import DeleteListModal from '../DeleteListModal/DeleteListModal';
import fetchCustomLists from '../../utils/fetchCustomLists';
import deleteIcon from '../../assets/icons/deleteList.svg';
import saveIcon from '../../assets/icons/saveList.svg';
import editIcon from '../../assets/icons/editList.svg';
import Loader from '../Loader/Loader';
import SearchBar from '../SearchBar/SearchBar';

const OtakuLists = () => {
    const [userLists, setUserLists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddListModal, setShowAddListModal] = useState(false);
    const [showDeleteListModal, setShowDeleteListModal] = useState(false);
    const [currentList, setCurrentList] = useState(null);
    const [editingListId, setEditingListId] = useState(null);
    const [listName, setListName] = useState("");
    const [renameError, setRenameError] = useState("");
    const [deleteConfirmation, setDeleteConfirmation] = useState("");
    const [query, setQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(() => {
        return parseInt(localStorage.getItem("otakuListsCurrentPage")) || 1;
    });
    const listsPerPage = 10;

    useEffect(() => {
        const fetchLists = async () => {
            setLoading(true);
            await fetchCustomLists((lists) => {
                setUserLists(lists);
                setLoading(false);
            });
        };

        fetchLists();
    }, []);

    const handleAddList = async (newListName) => {
        if (!newListName.trim()) return;

        try {
            const newList = await fetchData("lists/create", "POST", { name: newListName });
            setUserLists(prevLists => [...prevLists, newList]);

            setShowAddListModal(false);
        } catch (error) {
            console.error("Failed to create list:", error);
        }
    };

    const activeList = useMemo(() => {
        if (query.trim() === "") return userLists;
        const lowerQuery = query.toLowerCase();
        return userLists.filter(list =>
            list.name && list.name.toLowerCase().includes(lowerQuery)
        );
    }, [query, userLists]);
    const indexOfLastList = currentPage * listsPerPage;
    const indexOfFirstList = indexOfLastList - listsPerPage;
    const currentLists = useMemo(() =>
        activeList.slice(indexOfFirstList, indexOfLastList),
        [activeList, indexOfFirstList, indexOfLastList]);
    const totalPages = useMemo(() =>
        Math.ceil(activeList.length / listsPerPage), [activeList.length]);

    useEffect(() => {
        setCurrentPage(1);
    }, [query]);

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(Math.max(totalPages, 1));
        }
    }, [totalPages, currentPage]);

    const handleEditList = async (e, listId, newName) => {
        e.preventDefault();
        e.stopPropagation();

        if (!newName || newName.trim() === "") {
            setRenameError("A list name cannot be empty");
            setTimeout(() => setRenameError(""), 5000);
            return;
        };

        const nameExistsInOtherList = userLists.some(list =>
            list._id !== listId && list.name.trim().toLowerCase() === newName.trim().toLowerCase()
        );

        if (nameExistsInOtherList) {
            setRenameError("A list with this name already exists.");
            setTimeout(() => setRenameError(""), 5000);
            return;
        }

        try {
            const updatedList = await fetchData("lists/update", "PATCH", { listId, name: newName });

            setUserLists(prevLists =>
                prevLists.map(list => list._id === listId ? updatedList : list)
            );
            setEditingListId(null);
        } catch (error) {
            console.error("Failed to update list:", error);
        }
    };

    const openDeleteModal = (e, listId, listName, titleCount) => {
        e.preventDefault();
        e.stopPropagation();

        setCurrentList({ listId, listName, titleCount });
        setShowDeleteListModal(true);
    };

    const handleSearch = (query) => {
        setQuery(query);
    };

    return (
        <div className="otaku-lists-container">
            <div className="otaku-lists-wrapper">
                <div className="otaku-lists">
                    {userLists.length > 0 && (
                        <>
                            <button className='create-otaku-lists-button btn' onClick={() => setShowAddListModal(true)}>Create a list</button>
                            <SearchBar onSearch={handleSearch} />
                        </>
                    )}
                    {loading ? (
                        <Loader />
                    ) : query.trim() !== "" && activeList.length === 0 ? (
                        <div className="no-results">
                            <p>No results found for "{query}"</p>
                        </div>
                    ) : activeList.length > 0 ? (
                        currentLists.map((list, index) => {
                            const isEditing = editingListId === list._id;

                            return (
                                <div key={list._id || index} className="list-wrapper">
                                    {isEditing ? (
                                        <ListItem listIcon={icon}>
                                            <div className="list-details-container">
                                                <input
                                                    type="text"
                                                    value={listName}
                                                    onChange={(e) => setListName(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter") {
                                                            handleEditList(e, list._id, listName);
                                                        }
                                                    }}
                                                    className="list-name-input"
                                                />
                                                <div className="list-buttons-container">
                                                    <button onClick={(e) => handleEditList(e, list._id, listName)} className='save-list-name'>
                                                        <img src={saveIcon} alt="save-icon" />
                                                    </button>
                                                    <button
                                                        onClick={(e) => openDeleteModal(e, list._id, list.name, list.titleCount)}
                                                        className='delete-list'
                                                    >
                                                        <img src={deleteIcon} alt="delete-icon" />
                                                    </button>
                                                </div>
                                            </div>
                                        </ListItem>
                                    ) : (
                                        <Link to={`/titles/${list.name}`} className='list-link'>
                                            <ListItem listIcon={icon}>
                                                <div className="list-details-container">
                                                    <span>{`${list.name} (${list.titles.length})`}</span>
                                                    <div className="list-buttons-container">
                                                        <button
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                setEditingListId(list._id);
                                                                setListName(list.name);
                                                            }}
                                                            className='edit-list-name'
                                                        >
                                                            <img src={editIcon} alt="edit-icon" />
                                                        </button>
                                                        <button
                                                            onClick={(e) => openDeleteModal(e, list._id, list.name, list.titleCount)}
                                                            className='delete-list'
                                                        >
                                                            <img src={deleteIcon} alt="delete-icon" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </ListItem>
                                        </Link>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <div className="no-lists">
                            <img src={noListIcon} className='no-lists-image' alt='no-list-icon' />
                            <p>No lists</p>
                            <button className='no-lists-button btn' onClick={() => setShowAddListModal(true)}>Create a list</button>
                        </div>
                    )}
                </div>
                <LibraryPagination
                    totalPages={totalPages}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                />
            </div>

            {showAddListModal && (
                <>
                    <div className="overlay" onClick={() => setShowAddListModal(false)}></div>
                    <AddListModal onSave={handleAddList} onClose={() => setShowAddListModal(false)} existingLists={userLists.map(list => list.name)} />
                </>
            )}

            {showDeleteListModal && (
                <>
                    <div className="overlay" onClick={() => setShowDeleteListModal(false)}></div>
                    <DeleteListModal
                        listName={currentList.listName}
                        listId={currentList.listId}
                        titleCount={currentList.titleCount}
                        onClose={() => setShowDeleteListModal(false)}
                        userLists={userLists}
                        setUserLists={setUserLists}
                        setDeleteConfirmation={setDeleteConfirmation}
                    />
                </>
            )}

            {renameError && (
                <div className="rename-error-box">
                    <p>{renameError}</p>
                </div>
            )}
            {deleteConfirmation && (
                <div className="delete-confirmation-box">
                    <p>{deleteConfirmation}</p>
                </div>
            )}
        </div>
    );
};

export default OtakuLists;