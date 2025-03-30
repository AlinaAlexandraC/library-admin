import { fetchData } from "../services/apiService";

const fetchLists = async (setUserLists) => {
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

export default fetchLists;