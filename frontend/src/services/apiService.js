import { getAuth } from "firebase/auth";

export const fetchData = async (endpoint, method = 'GET', body = null) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) throw new Error("User not authenticated");

    const token = await user.getIdToken();

    const options = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/${endpoint}`, options);

    if (!response.ok) {
      if (response.status === 404) {
        return [];
      } else {
        throw new Error('Failed to fetch data');
      }
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error.message || 'An error occurred');
  }
};
