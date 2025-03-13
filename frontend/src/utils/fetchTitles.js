import { fetchData } from "../services/apiService";

const fetchTitles = async (setTitles, setError, setLoading) => {
    try {
        const data = await fetchData('titles/list');
        
        if (Array.isArray(data)) { 
            setTitles(data);
        } else {
            setError("Invalid response structure.");
        }
    } catch (error) {
        setError(error.message);
    } finally {
        setLoading(false);
    }
};

export default fetchTitles;