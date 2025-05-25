import "./ForgotPassword.css";
import Form from "../Form/Form";
import formImage from "../../assets/images/login-vertical.jpg";
import formImageHorizontal from "../../assets/images/login-horizontal.jpg";
import { useState } from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { useNavigate, Link } from "react-router";

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
            <Form formImage={formImage} formImageHorizontal={formImageHorizontal}>
                <form className="forgot-password-wrapper" onSubmit={handleResetPassword}>
                    <div className="forgot-password-title">Forgot Password</div>
                    <div className="forgot-password-email-container">
                        <label htmlFor="email">Email address</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="buttons">
                        <button type="submit" className="send-reset-link btn" >Send Reset Link</button>
                        <div className="return-to-login-button">
                            <Link to="/" className="link">
                                <div className="return-to-login btn">Go back to login</div>
                            </Link>
                        </div>
                    </div>
                    <div className={`${error ? "error" : "success"}`}>{error ? error : message}</div>
                    <div className="instruction">Password must be at least 8 characters long, contain one uppercase letter, and one number</div>
                </form>
            </Form>
        </div>
    );
};

export default ForgotPassword;