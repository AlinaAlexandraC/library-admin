import "./Password.css";
import seePasswordIcon from "../../assets/icons/see-password.svg";
import hidePasswordIcon from "../../assets/icons/hide-password.svg";
import { useState } from "react";

const Password = ({ formData, handleChange }) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="password-container">
            <input type={`${showPassword ? "text" : "password"}`} placeholder="********" className="password-input" name="password" value={formData.password} onChange={handleChange} required />
            <img src={`${showPassword ? hidePasswordIcon : seePasswordIcon}`} alt="password-visibility" className="password-toggle" onClick={() => setShowPassword(!showPassword)} />
        </div>
    );
};

export default Password;