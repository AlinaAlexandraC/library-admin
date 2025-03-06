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
        const wakeUpBackend = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/health`);

                if (response.ok) {
                    setSuccess(null);
                } else {
                    setSuccess("Waking up the server... Please wait ⏳");
                }
            } catch (error) {
                console.error("Error waking up backend:", error);
                setError("Failed to connect to the server. Try again later.");
            }
        };

        wakeUpBackend();

        const interval = setInterval(wakeUpBackend, 10000);

        return () => clearInterval(interval);
    }, []);

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

                await loginUser(formData);
                setSuccess("Welcome! Redirecting to library...");
                setTimeout(() => navigate(`/library`), 2000);
            } else {
                setError("Login failed: No user data received.");
            }
        } catch (error) {
            setError(error.message || "Login failed");
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
                        {/* <Link to="/forgot-password">Forgot Password</Link> */}
                    </div>
                    <button type="submit" className="login-button btn" >Sign in</button>
                </form>
                <div className={`${error ? "error" : "success"}`}>{error ? error : success}</div>
            </Form>
        </div>
    );
};

export default Login;