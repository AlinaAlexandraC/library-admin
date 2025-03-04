import Form from "../Form/Form";
import "./MyAccount.css";
import formImage from "../../assets/images/user-vertical.jpg";
import formImageHorizontal from "../../assets/images/user-horizontal.jpg";
import { useEffect, useState } from "react";
import { fetchData } from "../../services/apiService";

const MyAccount = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const data = await fetchData(`user/${userId}/profile`);

                setFirstName(data.first_name);
                setLastName(data.last_name);
                setEmail(data.email);
            } catch (error) {
                setError("Failed to load user data");
            }
        };

        fetchUserData();
    }, [userId]);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = async () => {
        if (!firstName.trim() || !lastName.trim() || !email.trim()) {
            setError("Fields cannot be empty");
            setTimeout(() => setError(null), 2000);
            setSuccess(null);
            return;
        }

        const userData = {
            first_name: firstName,
            last_name: lastName,
            email: email,
        };

        try {
            const response = await fetchData(`user/${userId}/profile`, 'PUT', userData);

            setError(null);
            setSuccess("Details saved successfully");
            setTimeout(() => setSuccess(null), 2000);
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to save item:", error);
            setError("Failed to save details. Please try again.");
            setTimeout(() => setError(null), 2000);
        }
    };

    return (
        <div className="my-account-container">
            <Form formImage={formImage} formImageHorizontal={formImageHorizontal}>
                <div className="my-account-title">Personal details</div>
                <div className="my-account-wrapper">
                    <div className="my-account-details">
                        <div className="first-name-container">
                            <label htmlFor="first-name">First name</label>
                            {isEditing ? (
                                <input type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="user-first-name-input" />
                            ) : (
                                <div className="user-first-name">{firstName}</div>
                            )}
                        </div>
                        <div className="last-name-container">
                            <label htmlFor="last-name">Last name</label>
                            {isEditing ? (
                                <input type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="user-last-name-input" />
                            ) : (
                                <div className="user-last-name">{lastName}</div>
                            )}
                        </div>
                        <div className="email-container">
                            <label htmlFor="email">Email</label>
                            {isEditing ? (
                                <input type="text"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="user-email-input" />
                            ) : (
                                <div className="user-email">{email}</div>
                            )}
                        </div>
                    </div>
                    <div className="buttons-container">
                        <div className="buttons">
                            {isEditing ? (
                                <button className="edit btn" onClick={handleSave}>Save details</button>
                            ) : (
                                <button className="edit btn" onClick={handleEdit}>Edit details</button>
                            )}
                            <button className="delete-account btn">Delete account</button>
                        </div>
                    </div>
                    <label className={`${error ? "error" : "success"}`}>{error ? error : success}</label>
                </div>
            </Form>
        </div>
    );
};

export default MyAccount;