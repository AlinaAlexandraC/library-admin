import './OtakuLists.css';
import { useEffect, useState } from 'react';
import AddListModal from '../AddListModal/AddListModal';
import noListIcon from '../../assets/images/no-lists.jpg';
import ListItem from '../ListItem/ListItem';
import icon from '../../assets/icons/manga.svg';
import { fetchData } from '../../services/apiService';
import LibraryPagination from '../LibraryPagination/LibraryPagination';
import { Link } from 'react-router';
import DeleteListModal from '../DeleteListModal/DeleteListModal';
import fetchLists from '../../utils/fetchLists';
import deleteIcon from '../../assets/icons/deleteList.svg';
import saveIcon from '../../assets/icons/saveList.svg';
import editIcon from '../../assets/icons/editList.svg';

const OtakuLists = () => {
    const [userLists, setUserLists] = useState([]);
    const [showAddListModal, setShowAddListModal] = useState(false);
    const [showDeleteListModal, setShowDeleteListModal] = useState(false);
    const [currentList, setCurrentList] = useState(null);
    const [editingListId, setEditingListId] = useState(null);
    const [listName, setListName] = useState("");

    useEffect(() => {
        fetchLists(setUserLists);
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

    const handleEditList = async (e, listId, newName) => {
        e.preventDefault();
        e.stopPropagation();

        if (!newName || newName.trim() === "") return;

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

    return (
        <div className="otaku-lists-container">
            <div className="otaku-lists-wrapper">
                {userLists.length > 0 ? (
                    <>
                        <button className='otaku-lists-button btn' onClick={() => setShowAddListModal(true)}>Create a list</button>
                        <div className="otaku-lists">
                            {userLists.map((list, index) => (
                                <Link to={`/titles/${list.name}`} key={list._id || index} className='list-link'>
                                    <ListItem listIcon={icon} >
                                        <div className="list-details-container">
                                            {editingListId === list._id ? (
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
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                    }}
                                                />
                                            ) : (
                                                <span>{list.name}</span>
                                            )}
                                            <div className="list-buttons-container">
                                                {editingListId === list._id ? (
                                                    <button onClick={(e) => handleEditList(e, list._id, listName)} className='save-list-name'>
                                                        <img src={saveIcon} alt="save-icon" />
                                                    </button>
                                                ) : (
                                                    <button onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        setEditingListId(list._id);
                                                        setListName(list.name);
                                                    }} className='edit-list-name'>
                                                        <img src={editIcon} alt="edit-icon" />
                                                    </button>
                                                )}
                                                <button onClick={(e) => openDeleteModal(e, list._id, list.name, list.titleCount)} className='delete-list'>
                                                    <img src={deleteIcon} alt="delete-icon" />
                                                </button >
                                            </div>
                                        </div>
                                    </ListItem>
                                </Link>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="no-lists">
                        <img src={noListIcon} className='no-lists-image' alt='no-list-icon' />
                        <p>No lists</p>
                        <button className='no-lists-button btn' onClick={() => setShowAddListModal(true)}>Create a list</button>
                    </div>
                )}
                <LibraryPagination />
            </div>
            {showAddListModal && (
                <>
                    <div className="overlay" onClick={() => setShowAddListModal(false)}></div>
                    <AddListModal onSave={handleAddList} onClose={() => setShowAddListModal(false)} />
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
                    />
                </>
            )}
        </div >
    );
};

export default OtakuLists;