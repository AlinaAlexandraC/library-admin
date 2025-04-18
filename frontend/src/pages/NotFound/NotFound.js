import "./NotFound.css";
import { Link } from "react-router";

const NotFound = () => {
    return (
        <div className="not-found-container">
            <div className="not-found">
                <span>Page Not Found</span>
                <span>The page you are looking for doesn't exist or has been removed</span>
                <Link to="/library" className="link">
                    <div className="return-home btn">Go back home</div>
                </Link>
            </div>
        </div>
    );
};

export default NotFound;