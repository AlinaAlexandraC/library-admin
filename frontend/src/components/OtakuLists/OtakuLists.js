import './OtakuLists.css';
import { useEffect, useState } from 'react';
import AddListModal from '../AddListModal/AddListModal';
import noListIcon from '../../assets/images/no-lists.jpg';
import ListItem from '../ListItem/ListItem';
import icon from '../../assets/icons/manga.svg';
import { fetchData } from '../../services/apiService';
import LibraryPagination from '../LibraryPagination/LibraryPagination';
import { Link } from 'react-router';

const OtakuLists = () => {
    const [userLists, setUserLists] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingList, setEditingList] = useState(null);
    const [newListName, setNewListName] = useState("");

    useEffect(() => {
        const fetchLists = async () => {
            try {
                const lists = await fetchData("lists/");
                const defaultListNames = ["Anime", "Movie", "Manga", "Series", "Book", "Unknown"];

                if (Array.isArray(lists)) {
                    const customLists = lists.filter(list => !defaultListNames.includes(list.name));
                    setUserLists(customLists);
                } else {
                    console.error("Lists is not an array", lists);
                }
            } catch (error) {
                console.error("Failed to fetch lists", error);
            }
        };

        fetchLists();
    }, []);

    const handleAddList = async (newListName) => {
        if (!newListName.trim()) return;

        try {
            const newList = await fetchData("lists/create", "POST", { name: newListName });
            setUserLists([...userLists, newList]);
            setShowModal(false);
        } catch (error) {
            console.error("Failed to create list:", error);
        }
    };

    const handleEditList = async (listId, currentName) => {
        const newName = prompt("Enter new list name:", currentName);

        if (!newName || newName.trim() === "") return;

        try {
            const updatedList = await fetchData("lists/update", "PATCH", { listId, name: newName });

            setUserLists(userLists.map(list => list._id === listId ? updatedList : list));
        } catch (error) {
            console.error("Failed to update list:", error);
        }
    };

    const handleDeleteList = async (listId) => {
        const deleteType = prompt(
            "Do you want to delete the list and all titles inside it? Type 'all' to delete both, or 'list' to just delete the list."
        );

        if (!deleteType) return;

        const deleteTitles = deleteType.toLowerCase() === 'all';

        try {
            const response = await fetchData("lists/delete", "DELETE", { listId, deleteTitles });

            if (response.status === 200) {
                setUserLists(userLists.filter(list => list._id !== listId));
            } else {
                console.error("Failed to delete list:", response.message || 'Unknown error');
            }
        } catch (error) {
            console.error("Failed to delete list:", error);
        }
    };

    return (
        <div className="otaku-lists-container">
            <div className="otaku-lists-wrapper">
                {userLists.length > 0 ? (
                    <>
                        <button className='otaku-lists-button btn' onClick={() => setShowModal(true)}>Create a list</button>
                        <div className="otaku-lists">
                            {userLists.map((list) => (
                                <Link to={`/lists/${list.name}`} key={list._id}>
                                    <ListItem listIcon={icon} >
                                        <div className="list-details-container">
                                            <span>{list.name}</span>
                                            <div className="buttons-cotainer">
                                                <button onClick={() => handleDeleteList(list._id)}>x</button>
                                                <button onClick={() => handleEditList(list._id, list.name)}>edit</button>
                                            </div>
                                        </div>
                                    </ListItem>
                                </Link>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="no-lists">
                        <img src={noListIcon} className='no-lists-image' />
                        <p>No lists</p>
                        <button className='no-lists-button btn' onClick={() => setShowModal(true)}>Create a list</button>
                    </div>
                )}
                <LibraryPagination />
            </div>
            {
                showModal && (
                    <>
                        <div className="overlay" onClick={() => setShowModal(false)}></div>
                        <AddListModal onSave={handleAddList} onClose={() => setShowModal(false)} />
                    </>
                )
            }
        </div >
    );
};

export default OtakuLists;