import { fetchData } from "../services/apiService";

const fetchTitles = async (listId, setTitles, setError, setLoading) => {
    try {
        const titles = await fetchData(`titles/${listId}`);

        if (!Array.isArray(titles)) {
            throw new Error("Invalid response structure for titles.");
        }
        
        setTitles(titles);
    } catch (error) {
        if (error.message !== 'No titles found for this list.') {
            setError(error.message);
        }
    } finally {
        setLoading(false);
    }
};

export default fetchTitles;