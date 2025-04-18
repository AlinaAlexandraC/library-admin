import { auth } from "../config/firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import axios from "axios";

// Register User

export const registerUser = async (formData) => {
  try {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, formData, { withCredentials: true });

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Registration failed");
  }
};

// Login User

export const loginUser = async (formData) => {
  const { email, password } = formData;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const idToken = await userCredential.user.getIdToken();

    const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/`,
      { token: idToken },
      { withCredentials: true }
    );

    return response.data;
  } catch (error) {    
    throw new Error(error.response?.data?.message);
  }
};

// Log out User

export const logoutUser = async () => {
  try {
    await signOut(auth);

    await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/logout`, {}, { withCredentials: true });
  } catch (error) {
    throw new Error(error.response?.data?.message || "Log out failed");
  }
};
