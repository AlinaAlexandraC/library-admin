import { useState } from "react";
import "./DeleteAccount.css";
import { useNavigate } from "react-router";
import { fetchData } from "../../services/apiService";

const DeleteAccount = ({ onClose, setFloatingMessage }) => {
    const [input, setInput] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    const handleDelete = async (e) => {
        e.preventDefault();

        if (input === "delete my account") {
            try {
                setIsDeleting(true);
                setFloatingMessage(null);

                await fetchData("users/delete", "DELETE");

                localStorage.removeItem("rememberedEmail");
                navigate("/");
                onClose();
            } catch (error) {
                setFloatingMessage({ text: "Error deleting the account. Please try again.", type: "error" });
                setTimeout(() => setFloatingMessage(null), 3000);
            }
        } else {
            setFloatingMessage({ text: "Confirmation phrase doesn't match. Please type the exact phrase.", type: "error" });
            setTimeout(() => setFloatingMessage(null), 3000);
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
        </div>
    );
};

export default DeleteAccount;