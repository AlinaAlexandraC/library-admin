import { useState } from 'react';
import './OtakuLists.css';
import AddListModal from '../AddListModal/AddListModal';

const OtakuLists = () => {
    const [userLists, setUserLists] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const handleAddList = (newListName) => {
        if (!newListName.trim()) return;

        setUserLists([...userLists, newListName]);
        setShowModal(false);
    };

    return (
        <div className="otaku-lists-container">
            <div className="otaku-lists-wrapper">
                <div>Create list</div>
                {userLists.length > 0 ? (
                    <div className="otaku-lists">
                        <ul>
                            {userLists.map((name, index) => (
                                <li key={index}>{name}</li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <div className="no-list">
                        <p>No lists</p>
                        <button onClick={() => setShowModal(true)}>Create a list</button>
                    </div>
                )}
            </div>
            {showModal && <AddListModal onSave={handleAddList} onClose={() => setShowModal(false)} />}
        </div>
    );
};

export default OtakuLists;