import "./NavBar.css";
import userIcon from "../../assets/icons/user.svg";
import libraryIcon from "../../assets/icons/library.svg";
import formIcon from "../../assets/icons/form.svg";
import randomIcon from "../../assets/icons/random.svg";
import { Link, useNavigate } from "react-router";
import { useEffect, useRef, useState } from "react";
import { logoutUser } from "../../services/authService";
import HelpMeModal from "../HelpMeModal/HelpMeModal";

const NavBar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [openModal, setOpenModal] = useState(false);
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
                                <Link to="/account" className="link user-dropdown-content-profile" onClick={() => setIsDropdownOpen(false)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 24 24" fill="none">
                                        <path d="M14.5 8.5C14.5 9.88071 13.3807 11 12 11C10.6193 11 9.5 9.88071 9.5 8.5C9.5 7.11929 10.6193 6 12 6C13.3807 6 14.5 7.11929 14.5 8.5Z" fill="#000000" />
                                        <path d="M15.5812 16H8.50626C8.09309 16 7.87415 15.5411 8.15916 15.242C9.00598 14.3533 10.5593 13 12.1667 13C13.7899 13 15.2046 14.3801 15.947 15.2681C16.2011 15.5721 15.9774 16 15.5812 16Z" fill="#000000" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <circle cx="12" cy="12" r="10" stroke="#000000" strokeWidth="2" />
                                    </svg>
                                    <span>Profile</span>
                                </Link>
                                <div
                                    className="user-dropdown-content-help"
                                    onClick={() => {
                                        setOpenModal(true);
                                        setIsDropdownOpen(false);
                                    }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 24 24" fill="none">
                                        <path d="M23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12ZM3.00683 12C3.00683 16.9668 7.03321 20.9932 12 20.9932C16.9668 20.9932 20.9932 16.9668 20.9932 12C20.9932 7.03321 16.9668 3.00683 12 3.00683C7.03321 3.00683 3.00683 7.03321 3.00683 12Z" fill="#0F0F0F" />
                                        <path d="M13.5 18C13.5 18.8284 12.8284 19.5 12 19.5C11.1716 19.5 10.5 18.8284 10.5 18C10.5 17.1716 11.1716 16.5 12 16.5C12.8284 16.5 13.5 17.1716 13.5 18Z" fill="#0F0F0F" />
                                        <path d="M11 12V14C11 14 11 15 12 15C13 15 13 14 13 14V12C13 12 13.4792 11.8629 13.6629 11.7883C13.6629 11.7883 13.9969 11.6691 14.2307 11.4896C14.4646 11.3102 14.6761 11.097 14.8654 10.8503C15.0658 10.6035 15.2217 10.3175 15.333 9.99221C15.4443 9.66693 15.5 9.4038 15.5 9C15.5 8.32701 15.3497 7.63675 15.0491 7.132C14.7596 6.61604 14.3476 6.21786 13.8132 5.93745C13.2788 5.64582 12.6553 5.5 11.9427 5.5C11.4974 5.5 11.1021 5.55608 10.757 5.66825C10.4118 5.7692 10.1057 5.9094 9.83844 6.08887C9.58236 6.25712 9.36525 6.4478 9.18711 6.66091C9.02011 6.86281 8.8865 7.0591 8.78629 7.24978C8.68609 7.44046 8.61929 7.6087 8.58589 7.75452C8.51908 7.96763 8.49125 8.14149 8.50238 8.27609C8.52465 8.41069 8.59145 8.52285 8.70279 8.61258C8.81413 8.70231 8.9867 8.79765 9.22051 8.8986C9.46546 8.97712 9.65473 9.00516 9.78834 8.98273C9.93308 8.96029 10.05 8.89299 10.1391 8.78083C10.1391 8.78083 10.6138 8.10569 10.7474 7.97109C10.8922 7.82528 11.0703 7.71312 11.2819 7.6346C11.4934 7.54487 11.7328 7.5 12 7.5C12.579 7.5 13.0076 7.64021 13.286 7.92062C13.5754 8.18982 13.6629 8.41629 13.6629 8.93225C13.6629 9.27996 13.6017 9.56038 13.4792 9.77349C13.3567 9.9866 13.1953 10.1605 12.9949 10.2951C12.9949 10.2951 12.7227 10.3991 12.5 10.5C12.2885 10.5897 11.9001 10.7381 11.6997 10.8503C11.5104 10.9512 11.4043 11.0573 11.2819 11.2144C11.1594 11.3714 11 11.7308 11 12Z" fill="#0F0F0F" />
                                    </svg>
                                    <span>Help me</span>
                                </div>
                                <div className="log-out-button" onClick={handleLogout}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 24 24" fill="none">
                                        <path d="M16 17L21 12M21 12L16 7M21 12H9M9 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21H9" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <span>Log out</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {openModal && <HelpMeModal onClose={() => setOpenModal(false)} />}
        </div>
    );
};

export default NavBar;