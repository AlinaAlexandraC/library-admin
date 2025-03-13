import "./NavBar.css";
import userIcon from "../../assets/icons/user.svg";
import libraryIcon from "../../assets/icons/library.svg";
import formIcon from "../../assets/icons/form.svg";
import randomIcon from "../../assets/icons/random.svg";
import { Link, useNavigate } from "react-router";
import { useEffect, useRef, useState } from "react";
import { logoutUser } from "../../services/authService";

const NavBar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    const handleLogout = async (e) => {
        e.preventDefault();

        try {
            await logoutUser();
            navigate("/");
        } catch (error) {
            console.error("Failed to log out:", error);
        }
    };

    return (
        <div className="nav-bar-container">
            <div className="nav-bar-wrapper">
                <div className="nav-bar-header">
                    <Link to="/lists" className="link">
                        <div className="nav-bar-library">
                            <img src={libraryIcon} alt="library-icon" className="library-icon" />
                            <span>Library</span>
                        </div>
                    </Link>
                    <Link to="/form" className="link">
                        <div className="nav-bar-form">
                            <img src={formIcon} alt="form-icon" className="form-icon" />
                            <span>Add To List</span>
                        </div>
                    </Link>
                    <Link to="/randomizer" className="link">
                        <div className="nav-bar-randomizer">
                            <img src={randomIcon} alt="random-icon" className="random-icon" />
                            <span>Randomizer</span>
                        </div>
                    </Link>
                    <div className={`nav-bar-user ${isDropdownOpen ? "open" : ""}`} ref={dropdownRef}>
                        <button className="user-dropdown-button" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                            <img src={userIcon} alt="user-icon" className="user-icon" />
                            <span>My Account</span>
                        </button>
                        {isDropdownOpen && (
                            <div className="user-dropdown-content">
                                <Link to="/account" className="link" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                                    <div>Profile</div>
                                </Link>
                                <button className="log-out-button btn" onClick={handleLogout}>
                                    <div>Log out</div>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NavBar;