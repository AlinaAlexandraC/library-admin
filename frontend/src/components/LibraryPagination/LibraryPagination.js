import "./LibraryPagination.css";
import rightArrowIcon from "../../assets/icons/right-arrow.svg";
import leftArrowIcon from "../../assets/icons/left-arrow.svg";

const LibraryPagination = ({ totalPages, setCurrentPage, currentPage }) => {
    return (
        <div className="library-pagination">
            <img
                src={leftArrowIcon}
                alt="left-arrow-icon"
                className={`left-arrow-icon ${currentPage === 1 ? "disabled" : ""}`}
                onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
            />
            <div className="page-number">{currentPage}</div>
            <img
                src={rightArrowIcon}
                alt="right-arrow-icon"
                className={`right-arrow-icon ${currentPage >= totalPages ? "disabled" : ""}`}
                onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
            />
        </div>
    );
};

export default LibraryPagination;