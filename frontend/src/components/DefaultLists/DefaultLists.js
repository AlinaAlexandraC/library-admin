import ListItem from "../ListItem/ListItem";
import "./DefaultLists.css";
import animeIcon from "../../assets/icons/anime.svg";
import bookIcon from "../../assets/icons/book.svg";
import mangaIcon from "../../assets/icons/manga.svg";
import movieIcon from "../../assets/icons/movie.svg";
import seriesIcon from "../../assets/icons/series.svg";
import unknownIcon from "../../assets/icons/unknown.svg";
import { Link } from "react-router";
import { useEffect, useState } from "react";
import { fetchData } from "../../services/apiService";

const DefaultLists = () => {
    const [defaultLists, setDefaultLists] = useState({
        anime: [],
        book: [],
        manga: [],
        movie: [],
        series: [],
        unknown: []
    });

    const fetchListsSummary = async () => {
        try {
            const lists = await fetchData("lists/");
            return lists.reduce((acc, list) => {
                acc[list.name.toLowerCase()] = list.titleCount > 0;
                return acc;
            }, {});
        } catch (error) {
            console.error("Failed to fetch lists summary", error);
            return {};
        }
    };

    useEffect(() => {
        const fetchSummary = async () => {
            const listsData = await fetchListsSummary();
            setDefaultLists({
                anime: listsData["anime"] || false,
                book: listsData["book"] || false,
                manga: listsData["manga"] || false,
                movie: listsData["movie"] || false,
                series: listsData["series"] || false,
                unknown: listsData["unknown"] || false
            });
        };

        fetchSummary();
    }, []);

    return (
        <div className="default-lists-container">
            <div className="default-lists-wrapper">
                <Link to="/titles/anime" className={`list-link ${!defaultLists.anime ? 'disabled' : ''}`}>
                    <ListItem listIcon={animeIcon}>Animes</ListItem>
                </Link>
                <Link to="/titles/book" className={`list-link ${!defaultLists.book ? 'disabled' : ''}`}>
                    <ListItem listIcon={bookIcon}>Books</ListItem>
                </Link>
                <Link to="/titles/manga" className={`list-link ${!defaultLists.manga ? 'disabled' : ''}`}>
                    <ListItem listIcon={mangaIcon}>Mangas</ListItem>
                </Link>
                <Link to="/titles/movie" className={`list-link ${!defaultLists.movie ? 'disabled' : ''}`}>
                    <ListItem listIcon={movieIcon}>Movies</ListItem>
                </Link>
                <Link to="/titles/series" className={`list-link ${!defaultLists.series ? 'disabled' : ''}`}>
                    <ListItem listIcon={seriesIcon}>Series</ListItem>
                </Link>
                <Link to="/titles/unknown" className={`list-link ${!defaultLists.unknown ? 'disabled' : ''}`}>
                    <ListItem listIcon={unknownIcon}>Unknown</ListItem>
                </Link>
            </div>
        </div>
    );
};

export default DefaultLists;