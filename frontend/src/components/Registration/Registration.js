import "./Registration.css";
import Form from "../Form/Form";
import { useState } from "react";
import { useNavigate } from "react-router";
import { registerUser } from "../../services/authService";
import formImage from "../../assets/images/registration-vertical.jpg";
import formImageHorizontal from "../../assets/images/registration-horizontal.jpg";
import Password from "../Password/Password";
import { Link } from "react-router";

const Registration = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        return emailRegex.test(email);
    };

    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+={}[\]:;"'<>,.?/\\|-]{8,}$/;

        return passwordRegex.test(password);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateEmail(formData.email)) {
            setError("Invalid email");
            setTimeout(() => setError(""), 2000);
            return;
        }

        if (!validatePassword(formData.password)) {
            setError("Password must be at least 8 characters long, contain one uppercase letter, and one number");
            setTimeout(() => setError(""), 2000);
            return;
        }

        try {
            await registerUser(formData);
            setSuccess("Registration successful! Redirecting to login...");
            setTimeout(() => navigate("/"), 2000);
        } catch (error) {
            if (error.message.includes("Email is already in use")) {
                setError("The email is already in use. Please choose a different one.");
            } else {
                setError("Registration failed. Try again later!");
            }

            setTimeout(() => setError(""), 2000);
        }
    };

    return (
        <div className="registration-container">
            <Form formImage={formImage} formImageHorizontal={formImageHorizontal}>
                <form className="registration-wrapper" onSubmit={handleSubmit}>
                    <div className="registration-title">Create an account</div>
                    <div className="registration-name">
                        <div className="registration-first-name-container">
                            <label>First name</label>
                            <input type="text" placeholder="ex. John" className="first-name-input" name="firstName" value={formData.firstName} onChange={handleChange} required />
                        </div>
                        <div className="registration-last-name-container">
                            <label>Last name</label>
                            <input type="text" placeholder="ex. Doe" className="last-name-input" name="lastName" value={formData.lastName} onChange={handleChange} required />
                        </div>
                    </div>
                    <div className="registration-email-container">
                        <label>Email address</label>
                        <input type="email" placeholder="john.doe@example.com" name="email" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="registration-password-container">
                        <label>Password</label>
                        <Password formData={formData} handleChange={handleChange} />
                    </div>
                    <div className="registration-terms">
                        By selecting <strong>Create account</strong>, you agree to our <Link to='/user-agreement'>User Agreement</Link> and acknowledge reading our <Link to='/user-privacy-notice'>User Privacy Notice</Link>.
                    </div>
                    <button type="submit" className="registration-button btn">Create account</button>
                    <div className="go-to-login">Already have an account? <Link to="/">Sign in</Link></div>
                </form>
                <div className={`${error ? "error" : "success"}`} id="password-validation">{error ? error : success}</div>
            </Form>
        </div>
    );
};

export default Registration;