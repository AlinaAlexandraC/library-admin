import { useEffect, useRef, useState } from "react";
import "./AnimeItem.css";
import ItemButtons from "../ItemButtons/ItemButtons";
import { editTitle, removeTitle } from "../../services/titleService";

const AnimeItem = ({ title, onDelete, handleSave }) => {
    const handleRef = useRef(null);
    const [checks, setChecks] = useState(3);
    const [isChecked, setIsChecked] = useState(title.status);
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState({ ...title });

    const toggleChecked = async () => {
        setIsChecked(prev => !prev);
        try {
            await editTitle({ ...title, checked: !isChecked });
        } catch (error) {
            setIsChecked(prev => !prev);
        }
    };

    const handleSaveClick = async () => {
        try {
            const response = await editTitle(editedTitle);
            if (!response || response.error) {
                throw new Error("Failed to update title");
            }

            setIsEditing(false);
            handleSave(editedTitle);
        } catch (error) {
            console.error("Failed to save item:", error);
        }
    };

    const handleDelete = async () => {
        try {
            await removeTitle(title.id);
            onDelete(title.id);
        } catch (error) {
            console.error("Failed to delete item:", error);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setEditedTitle((prevTitle) => ({
            ...prevTitle,
            [name]: value,
        }));
    };

    useEffect(() => {
        const calculateChecks = () => {
            if (handleRef.current) {
                const handleWidth = handleRef.current.clientWidth;
                const checkWidth = 45;
                const checksNumber = Math.max(1, Math.floor(handleWidth / checkWidth));
                setChecks(checksNumber);
            }
        };

        calculateChecks();
        window.addEventListener("resize", calculateChecks);
        return () => window.removeEventListener("resize", calculateChecks);
    }, []);

    return (
        <div className="anime-item-container">
            <div className="katana">
                <div className="katana-handle" ref={handleRef}>
                    <div className="pattern">
                        {[...Array(checks)].map((_, index) => {
                            return <div key={index} className={`check-${index}`}></div>;
                        })}
                    </div>
                    <div className="katana-guard"></div>
                    <div className="katana-middle"></div>
                </div>
                <div className="katana-blade">
                    <div className="anime-information">
                        {isEditing ? (
                            <input type="text" name="title" value={editedTitle.title} onChange={handleChange} className="title-input" />
                        ) : (
                            <span className="name">{title.title}</span>
                        )}
                        <div className="anime-details">{title.type}</div>
                    </div>
                    <div className="katana-shadow"></div>
                </div>
            </div>
            <ItemButtons isChecked={isChecked} isEditing={isEditing} setIsEditing={setIsEditing} toggleChecked={toggleChecked} />
        </div>
    );
};

export default AnimeItem;