import ListItem from "../ListItem/ListItem";
import "./DefaultLists.css";
import animeIcon from "../../assets/icons/anime.svg";
import bookIcon from "../../assets/icons/book.svg";
import mangaIcon from "../../assets/icons/manga.svg";
import movieIcon from "../../assets/icons/movie.svg";
import seriesIcon from "../../assets/icons/series.svg";
import unknownIcon from "../../assets/icons/unknown.svg";
import { Link } from "react-router";

const DefaultLists = () => {
    return (
        <div className="default-lists-container">
            <div className="default-lists-wrapper">
                <Link to="/library" className="link">
                    <ListItem listIcon={animeIcon}>Animes</ListItem>
                </Link>
                <Link to="#" className="link">
                    <ListItem listIcon={bookIcon}>Books</ListItem>
                </Link>
                <Link to="#" className="link">
                    <ListItem listIcon={mangaIcon}>Mangas</ListItem>
                </Link>
                <Link to="#" className="link">
                    <ListItem listIcon={movieIcon}>Movies</ListItem>
                </Link>
                <Link to="#" className="link">
                    <ListItem listIcon={seriesIcon}>Series</ListItem>
                </Link>
                <Link to="#" className="link">
                    <ListItem listIcon={unknownIcon}>Miscellaneous</ListItem>
                </Link>
            </div>
        </div>
    );
};

export default DefaultLists;