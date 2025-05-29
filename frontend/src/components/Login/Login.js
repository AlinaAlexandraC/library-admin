import "./Login.css";
import Form from "../Form/Form";
import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { loginUser } from "../../services/authService";
import formImage from "../../assets/images/login-vertical.jpg";
import formImageHorizontal from "../../assets/images/login-horizontal.jpg";
import Password from "../Password/Password";

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [floatingMessage, setFloatingMessage] = useState(null);
    const [rememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        const storedEmail = localStorage.getItem("rememberedEmail");
        if (storedEmail) {
            setFormData((prevFormData) => ({ ...prevFormData, email: storedEmail }));
            setRememberMe(true);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFloatingMessage(null);

        try {
            const response = await loginUser(formData);

            if (response.user) {
                if (rememberMe) {
                    localStorage.setItem("rememberedEmail", formData.email);
                } else {
                    localStorage.removeItem("rememberedEmail");
                }

                setFloatingMessage({ type: "success", text: "Welcome! Redirecting to library..." });
                setTimeout(() => navigate(`/lists`), 2000);
            } else {
                setFloatingMessage({ type: "error", text: "Login failed: No user data received. Please try again." });
            }
        } catch (error) {
            let message = "An error occurred during login.";
            if (error.code === "auth/too-many-requests") {
                message = "Too many attempts. Please wait a moment and try again.";
            } else if (error.code === "auth/invalid-credential") {
                message = "Please check your credentials and try again.";
            }

            setFloatingMessage({ type: "error", text: message });
            setTimeout(() => setFloatingMessage(null), 3000);
        }
    };

    useEffect(() => {
        localStorage.removeItem("libraryCurrentPage");
    }, []);

    return (
        <div className="login-container">
            <Form
                formImage={formImage}
                formImageHorizontal={formImageHorizontal}
                header="Sign in to your account"
                floatingMessage={floatingMessage && floatingMessage.text ? floatingMessage : null}
                onSubmit={handleSubmit}
                buttons={[
                    {
                        label: "Sign in",
                        type: "submit",
                        className: "login-button btn",
                    }
                ]}>
                <div className="registration-question">
                    <div>New to Library?</div>
                    <Link to="/registration">
                        <div className="create-account">
                            Create account
                        </div>
                    </Link>
                </div>
                <div className="login-email-container">
                    <label>Email address</label>
                    <input type="email" placeholder="john.doe@example.com" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="registration-password-container">
                    <Password
                        label="Password"
                        name="password"
                        value={formData.password}
                        handleChange={handleChange}
                    />
                </div>
                <div className="password-validation">
                    <div className="remember-me-container">
                        <input type="checkbox" className="remember-me" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} />
                        <label className="remember-me-label">Remember me</label>
                    </div>
                    <Link to="/forgot-password">Forgot Password</Link>
                </div>
            </Form>
        </div>
    );
};

export default Login;