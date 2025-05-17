import "./AddTitlesPage.css";
import { useState } from "react";
import AddToLibrary from "../../components/AddTitlesManually/AddTitlesManually";
import AddTitlesFromFolder from "../../components/AddTitlesFromFolder/AddTitlesFromFolder";
import AddTitlesFromScanner from "../../components/AddTitlesFromScanner/AddTitlesFromScanner";

const AddTitlesPage = () => {
    const [activeTab, setActiveTab] = useState("Manually");

    return (
        <div className="add-titles-page-container">
            <div className="tab-container">
                <div
                    className={`tab-item ${activeTab === "Manually" ? "active" : ""}`}
                    onClick={() => setActiveTab("Manually")}
                >
                    Manually
                </div>
                <div
                    className={`tab-item ${activeTab === "Folder" ? "active" : ""}`}
                    onClick={() => setActiveTab("Folder")}
                >
                    Folder
                </div>
                <div
                    className={`tab-item ${activeTab === "Scanner" ? "active" : ""}`}
                    onClick={() => setActiveTab("Scanner")}
                >
                    Scanner
                </div>
            </div>
            {activeTab === "Manually" && <AddToLibrary />}
            {activeTab === "Folder" && <AddTitlesFromFolder />}
            {activeTab === "Scanner" && <AddTitlesFromScanner />}
        </div>
    );
};

export default AddTitlesPage;