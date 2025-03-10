import ListItem from "../ListItem/ListItem";
import "./ListsContainer.css";
import animeIcon from "../../assets/icons/anime.svg";
import bookIcon from "../../assets/icons/book.svg";
import mangaIcon from "../../assets/icons/manga.svg";
import movieIcon from "../../assets/icons/movie.svg";
import seriesIcon from "../../assets/icons/series.svg";
import { Link } from "react-router";

const ListsContainer = () => {
    return (
        <div className="lists-container">
            <div className="lists-wrapper">
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
            </div>
        </div>
    );
};

export default ListsContainer;