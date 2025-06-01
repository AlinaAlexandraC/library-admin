import Form from "../Form/Form";
import "./MyAccount.css";
import formImage from "../../assets/images/user-vertical.jpg";
import formImageHorizontal from "../../assets/images/user-horizontal.jpg";
import { useEffect, useRef, useState } from "react";
import { fetchData } from "../../services/apiService";
import DeleteAccount from "../DeleteAccount/DeleteAccount";

const MyAccount = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [floatingMessage, setFloatingMessage] = useState(null);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [originalUserData, setOriginalUserData] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const editRef = useRef();

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                editRef.current &&
                !editRef.current.contains(event.target) &&
                !event.target.closest('.btn')
            ) {
                setIsEditing(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isEditing]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const data = await fetchData("users/details");

                setFirstName(data.firstName);
                setLastName(data.lastName);
                setEmail(data.email);
                setOriginalUserData({
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                });
            } catch (error) {
                setFloatingMessage({ type: "error", text: "Failed to load user data" });
            }
        };

        fetchUserData();
    }, []);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = async () => {
        if (!firstName.trim() || !lastName.trim() || !email.trim()) {
            setFloatingMessage({ type: "error", text: "Fields cannot be empty" });
            setTimeout(() => setFloatingMessage(null), 3000);
            return;
        }

        if (
            originalUserData &&
            firstName === originalUserData.firstName &&
            lastName === originalUserData.lastName &&
            email === originalUserData.email
        ) {
            setFloatingMessage({ type: "info", text: "No changes detected." });
            setTimeout(() => setFloatingMessage(null), 3000);
            setIsEditing(false);
            return;
        }

        const userData = {
            firstName: firstName,
            lastName: lastName,
            email: email,
        };

        try {
            await fetchData("users/update", 'PATCH', userData);

            setFloatingMessage({ type: "success", text: "Details saved successfully" });
            setTimeout(() => setFloatingMessage(null), 3000);
            setIsEditing(false);
            setOriginalUserData(userData);
        } catch (error) {
            console.error("Failed to save item:", error);
            setFloatingMessage({ type: "error", text: "Failed to save details. Please try again." });
            setTimeout(() => setFloatingMessage(null), 3000);
        }
    };

    const handleDeleteClick = () => {
        setShowDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
    };

    const buttons = isEditing
        ? [
            {
                label: "Save details",
                type: "button",
                className: "save btn",
                onClick: handleSave
            },
            {
                label: "Delete account",
                type: "button",
                className: "delete-account btn",
                onClick: handleDeleteClick
            }
        ]
        : [
            {
                label: "Edit details",
                type: "button",
                className: "edit btn",
                onClick: handleEdit
            },
            {
                label: "Delete account",
                type: "button",
                className: "delete-account btn",
                onClick: handleDeleteClick
            }


        ];

    return (
        <div className="my-account-container">
            <Form
                formImage={formImage}
                formImageHorizontal={formImageHorizontal}
                header="Personal details"
                floatingMessage={floatingMessage && floatingMessage.text ? floatingMessage : null}
                buttons={buttons}>
                <div className="my-account-wrapper">
                    <div className="my-account-details" ref={editRef}>
                        <div className="first-name-container">
                            <label>First name</label>
                            {isEditing ? (
                                <input type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="user-first-name-input" />
                            ) : (
                                <span className="user-first-name">{firstName}</span>
                            )}
                        </div>
                        <div className="last-name-container">
                            <label>Last name</label>
                            {isEditing ? (
                                <input type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="user-last-name-input" />
                            ) : (
                                <span className="user-last-name">{lastName}</span>
                            )}
                        </div>
                        <div className="email-container">
                            <label>Email</label>
                            {isEditing ? (
                                <input type="text"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="user-email-input" />
                            ) : (
                                <span className="user-email">{email}</span>
                            )}
                        </div>
                    </div>
                </div>
            </Form>
            {showDeleteModal && (
                <>
                    <div className="overlay" onClick={handleCloseDeleteModal}></div>
                    <DeleteAccount onClose={handleCloseDeleteModal} />
                </>
            )}
        </div>
    );
};

export default MyAccount;