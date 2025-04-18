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
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
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
        setError(null);
        setSuccess(null);

        try {
            const response = await loginUser(formData);

            if (response.user) {
                if (rememberMe) {
                    localStorage.setItem("rememberedEmail", formData.email);
                } else {
                    localStorage.removeItem("rememberedEmail");
                }

                setSuccess("Welcome! Redirecting to library...");
                setTimeout(() => navigate(`/lists`), 2000);
            } else {
                setError("Login failed: No user data received. Please try again.");
            }
        } catch (error) {
            if (error.message.includes("auth/too-many-requests")) {
                setError("Too many attempts. Please wait a moment and try again.");
            } else {
                setError("An error occurred during login.");
            }

            setTimeout(() => setError(""), 2000);
        }
    };

    useEffect(() => {
        localStorage.removeItem("libraryCurrentPage");
    }, []);

    return (
        <div className="login-container">
            <Form formImage={formImage} formImageHorizontal={formImageHorizontal}>
                <form className="login-wrapper" onSubmit={handleSubmit}>
                    <div className="login-title">Sign in to your account</div>
                    <div className="registration-question">
                        <div>New to Library?</div>
                        <Link to="/registration">
                            <div className="create-account">
                                Create account
                            </div>
                        </Link>
                    </div>
                    <label>Email address</label>
                    <input type="email" placeholder="john.doe@example.com" name="email" value={formData.email} onChange={handleChange} required />
                    <label>Password</label>
                    <Password formData={formData} handleChange={handleChange} />
                    <div className="password-validation">
                        <div className="remember-me-container">
                            <input type="checkbox" className="remember-me" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} />
                            <label className="remember-me-label">Remember me</label>
                        </div>
                        <Link to="/forgot-password">Forgot Password</Link>
                    </div>
                    <button type="submit" className="login-button btn" >Sign in</button>
                </form>
                <div className={`${error ? "error" : "success"}`}>{error ? error : success}</div>
            </Form>
        </div>
    );
};

export default Login;