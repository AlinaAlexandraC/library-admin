import { useEffect, useRef, useState } from "react";
import "./AnimeItem.css";
import ItemButtons from "../ItemButtons/ItemButtons";

const AnimeItem = () => {
    const handleRef = useRef(null);
    const [checks, setChecks] = useState(3);

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
                        <div className="anime-title">Apothecary Diaries</div>
                        <div className="anime-details">Other</div>
                    </div>
                    <div className="katana-shadow"></div>
                </div>
            </div>            
            <ItemButtons/>
        </div>
    );
};

export default AnimeItem;