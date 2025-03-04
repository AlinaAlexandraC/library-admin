import "./LibraryPagination.css";
import rightArrowIcon from "../../assets/icons/right-arrow.svg";
import leftArrowIcon from "../../assets/icons/left-arrow.svg";

const LibraryPagination = ({ totalPages, setCurrentPage, currentPage }) => {
    return (
        <div className="library-pagination">
            <img
                src={leftArrowIcon}
                alt="left-arrow-icon"
                className="left-arrow-icon"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1} />
            <div className="page-number">{currentPage}</div>
            <img
                src={rightArrowIcon}
                alt="right-arrow-icon"
                className="right-arrow-icon"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages} />
        </div>
    );
};

export default LibraryPagination;