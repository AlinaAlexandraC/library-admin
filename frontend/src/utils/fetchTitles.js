import { fetchData } from "../services/apiService";

const fetchTitles = async (setTitles, setError, setLoading) => {
    try {
        const data = await fetchData('list');
        if (data.success && Array.isArray(data.titles)) {
            setTitles(data.titles);
        } else {
            setError("No titles found.");
        }
    } catch (error) {
        setError(error.message);
    } finally {
        setLoading(false);
    }
};

export default fetchTitles;