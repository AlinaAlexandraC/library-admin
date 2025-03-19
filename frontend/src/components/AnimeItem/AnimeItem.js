import { useEffect, useRef, useState } from "react";
import "./AnimeItem.css";
import ItemButtons from "../ItemButtons/ItemButtons";

const AnimeItem = ({ title, setTitles }) => {
    const handleRef = useRef(null);
    const [checks, setChecks] = useState(3);
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState({ ...title || {} });

    const handleEdit = () => {
        setIsEditing(true);
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
                    {isEditing ? (
                        <div className="anime-information">
                            <input type="text" name="title" value={editedTitle.title} onChange={handleChange} className="katana-title-input" />
                        </div>
                    ) : (
                        <div className="anime-information">
                            <span className="name">{title.title}</span>
                                <div className="anime-details">{title.type || ""}</div>
                            <div className="katana-shadow"></div>
                        </div>
                    )}
                </div>
            </div>
            <ItemButtons title={title} setTitles={setTitles} editedTitle={editedTitle} setEditedTitle={setEditedTitle} isEditing={isEditing} setIsEditing={setIsEditing} handleEdit={handleEdit} />
        </div>
    );
};

export default AnimeItem;