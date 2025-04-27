import axios from "axios";
import { auth } from "../config/firebase";

export const fetchData = async (endpoint, method = 'GET', body = null) => {
  try {
    const user = auth.currentUser;

    if (!user) throw new Error("User not authenticated");

    const token = await user.getIdToken();

    const config = {
      url: `${process.env.REACT_APP_API_URL}/api/${endpoint}`,
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    };

    if (body !== null) {
      config.data = body;
    }

    const response = await axios(config);

    return response.data;
  } catch (error) {
    console.log(error.response?.data?.message);
    throw new Error(error.response?.data?.message || 'An error occurred');
  }
};
