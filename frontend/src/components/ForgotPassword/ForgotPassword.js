import "./ForgotPassword.css";
import Form from "../Form/Form";
import formImage from "../../assets/images/login-vertical.jpg";
import formImageHorizontal from "../../assets/images/login-horizontal.jpg";
import { useState } from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { useNavigate } from "react-router";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const auth = getAuth();
    const navigate = useNavigate();

    const handleResetPassword = async (e) => {
        e.preventDefault();

        const normalizedEmail = email.trim().toLowerCase();

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/check-email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: normalizedEmail }),
            });

            const data = await response.json();

            if (!data.emailExists) {
                setError("No user found with that email address.");
                setTimeout(() => setError(""), 3000);
                return;
            }

            await sendPasswordResetEmail(auth, normalizedEmail, {
                url: `https://library-admin-1.onrender.com/`,
            });

            setMessage("Password reset email sent! Please check your inbox.");
            setTimeout(() => {
                navigate("/");
            }, 3000);
        } catch (error) {
            console.error("Error during password reset:", error);
            setError(error.message || "Error sending reset email. Please try again.");
            setTimeout(() => setError(""), 3000);
        }
    };


    return (
        <div className="forgot-password-container">
            <Form
                formImage={formImage}
                formImageHorizontal={formImageHorizontal}
                header="Forgot Password"
                onSubmit={handleResetPassword}
                floatingMessage={
                    error
                        ? { type: "error", text: error }
                        : message
                            ? { type: "success", text: message }
                            : null
                }
                instruction={"Password must be at least 8 characters long, contain one uppercase letter, and one number"}
                buttons={[
                    {
                        label: "Send Reset Link",
                        type: "submit",
                        className: "send-reset-link btn",
                    },
                    {
                        label: "Go back to login",
                        type: "button",
                        className: "return-to-login btn",
                        onClick: () => navigate("/")
                    }
                ]} >
                <div className="forgot-password-email-container">
                    <label htmlFor="email">Email address</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="john.doe@example.com"
                    />
                </div>
            </Form>
        </div>
    );
};

export default ForgotPassword;