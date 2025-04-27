import "./Password.css";
import seePasswordIcon from "../../assets/icons/see-password.svg";
import hidePasswordIcon from "../../assets/icons/hide-password.svg";
import { useState } from "react";

const Password = ({ name, value, handleChange, label }) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="password-container">
            {label && <label>{label}</label>}
            <div className="password-input-wrapper">
                <input type={showPassword ? "text" : "password"} placeholder="********" className="password-input" name={name} value={value} onChange={handleChange} required />
                <img src={showPassword ? hidePasswordIcon : seePasswordIcon} alt="password-visibility" className="password-toggle" onClick={() => setShowPassword(!showPassword)} />
            </div>
        </div >
    );
};

export default Password;