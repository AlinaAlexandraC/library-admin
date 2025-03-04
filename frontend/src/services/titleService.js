const API_URL_ADD = 'http://localhost:5000/api/titles/add';
const API_URL_EDIT = 'http://localhost:5000/api/titles/edit';
const API_URL_DELETE = 'http://localhost:5000/api/titles/delete';

export const addTitle = async (titleData) => {
    try {
        const response = await fetch(API_URL_ADD, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(titleData),
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Failed to add title');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error(error.message || "An error occured");
    }
};

export const editTitle = async (titleData) => {
    try {
        const response = await fetch(API_URL_EDIT, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(titleData),
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error('Failed to update title');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error(error.message || "An error occured");
    }
};

export const removeTitle = async (id) => {
    try {
        const response = await fetch(API_URL_DELETE, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id }),
            credentials: "include"
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