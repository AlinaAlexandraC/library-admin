import { useState } from "react";

export const useEdit = ({ initialData, saveFunction }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState(initialData);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = async (newData) => {
        try {
            await saveFunction(newData);

            setIsEditing(newData);
            setEditedData(false);
        } catch (error) {
            console.error('Error saving data:', error);
        }
    };

    return { isEditing, editedData, handleEdit, handleSave };
};