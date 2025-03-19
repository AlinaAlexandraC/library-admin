import { getAuth } from "firebase/auth";

const API_URL_ADD = 'http://localhost:5000/api/titles/add';
const API_URL_EDIT = 'http://localhost:5000/api/titles/update';
const API_URL_DELETE = 'http://localhost:5000/api/titles/remove';

export const addTitle = async (titleData) => {
    try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) throw new Error("User is not authenticated");

        const token = await user.getIdToken();

        if (!token) throw new Error("User is not authenticated");

        const response = await fetch(API_URL_ADD, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(titleData)
        });

        if (!response.ok) {
            throw new Error('Failed to add title');
        }

        return await response.json();
    } catch (error) {
        throw new Error(error.message || "An error occured");
    }
};

export const editTitle = async (titleData) => {
    try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) throw new Error("User is not authenticated");

        const token = await user.getIdToken();

        if (!token) throw new Error("User is not authenticated");

        const response = await fetch(API_URL_EDIT, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                title_id: titleData._id,
                updatedData: titleData,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to update title');
        }

        return await response.json();
    } catch (error) {
        throw new Error(error.message || "An error occured");
    }
};

export const removeTitle = async (id) => {
    try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) throw new Error("User is not authenticated");

        const token = await user.getIdToken();

        if (!token) throw new Error("User is not authenticated");

        const response = await fetch(API_URL_DELETE, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title_id: id }),
        });

        if (!response.ok) {
            throw new Error("Failed to delete title");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error(error.message || "An error occured");
    }
};