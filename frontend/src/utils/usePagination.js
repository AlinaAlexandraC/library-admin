import { useState, useEffect, useRef } from "react";

const usePagination = (items, initialItemsPerPage = 10) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);
    const containerRef = useRef(null);
    useEffect(() => {
        const calculateItemsPerPage = () => {
            if (containerRef.current) {
                const listHeight = containerRef.current.clientHeight;
                const itemHeight = 100;
                const searchBarHeight = 50;
                const newItemsPerPage = Math.max(1, Math.floor((listHeight - searchBarHeight) / itemHeight));
                setItemsPerPage(newItemsPerPage);
            }
        };

        calculateItemsPerPage();
        window.addEventListener("resize", calculateItemsPerPage);
        return () => window.removeEventListener("resize", calculateItemsPerPage);
    }, [items]);

    const activeList = items;
    const totalPages = Math.ceil(activeList.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const displayedItems = activeList.slice(startIndex, startIndex + itemsPerPage);

    const goToNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    const goToPreviousPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    return {
        currentPage,
        totalPages,
        itemsPerPage,
        displayedItems,
        goToNextPage,
        goToPreviousPage,
        containerRef,
        setCurrentPage,
    };
};

export default usePagination;
