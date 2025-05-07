import { useState } from "react";
import "./DeleteAccount.css";
import { useNavigate } from "react-router";
import { fetchData } from "../../services/apiService";

const DeleteAccount = ({ onClose }) => {
    const [input, setInput] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    const handleDelete = async (e) => {
        e.preventDefault();

        if (input === "delete my account") {
            try {
                setIsDeleting(true);
                setError("");

                await fetchData("users/delete", "DELETE");
                localStorage.removeItem("rememberedEmail");
                navigate("/");
                onClose();
            } catch (error) {
                setError("Error deleting the account. Please try again.");
                setTimeout(() => setError(""), 3000);
            }
        } else {
            setError("Confirmation phrase doesn't match. Please type the exact phrase.");
            setTimeout(() => setError(""), 3000);
        }
    };

    return (
        <div className="delete-account-container">
            <h3>Are you sure you want to delete your account?</h3>
            <p>To confirm, please type <strong>delete my account</strong> in the box below:</p>
            <input type="text" value={input} onChange={handleInputChange} placeholder="Type the confirmation phrase here" />
            <button onClick={handleDelete} disabled={isDeleting} >
                {isDeleting ? "Deleting..." : "Delete Account"}
            </button>
            {error && (
                <p className="error">
                    {error}
                </p>
            )}
        </div>
    );
};

export default DeleteAccount;