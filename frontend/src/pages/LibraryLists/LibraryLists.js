import "./LibraryLists.css";
import DefaultLists from "../../components/DefaultLists/DefaultLists";
import { useState } from "react";
import OtakuLists from "../../components/OtakuLists/OtakuLists";

const LibraryLists = () => {
    const [activeTab, setActiveTab] = useState("OtakuLists");

    return (
        <div className="library-lists-container">
            <div className="tab-container">
                <div
                    className={`tab-item ${activeTab === "OtakuLists" ? "active" : ""}`}
                    onClick={() => setActiveTab("OtakuLists")}>
                    OtakuLists
                </div>
                <div
                    className={`tab-item ${activeTab === "Default" ? "active" : ""}`}
                    onClick={() => setActiveTab("Default")}>
                    Default
                </div>
            </div>
            {activeTab === "OtakuLists" && <OtakuLists />}
            {activeTab === "Default" && <DefaultLists />}
        </div>
    );
};

export default LibraryLists;