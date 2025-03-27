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

    const fetchListTitles = async (listName) => {
        try {
            const titles = await fetchData(`titles/${listName}`);
            return titles;
        } catch (error) {
            console.error(`Failed to fetch titles for ${listName}`, error);
            return [];
        }
    };

    useEffect(() => {
        const fetchAllTitles = async () => {
            setDefaultLists({
                anime: await fetchListTitles('anime'),
                book: await fetchListTitles('book'),
                manga: await fetchListTitles('manga'),
                movie: await fetchListTitles('movie'),
                series: await fetchListTitles('series'),
                unknown: await fetchListTitles('unknown')
            });
        };

        fetchAllTitles();
    }, []);

    const isListEmpty = (list) => list.length === 0;

    return (
        <div className="default-lists-container">
            <div className="default-lists-wrapper">
                <Link to="/lists/anime" className={`link ${isListEmpty(defaultLists.anime) ? 'disabled' : ''}`}>
                    <ListItem listIcon={animeIcon}>Animes</ListItem>
                </Link>
                <Link to="/lists/book" className={`link ${isListEmpty(defaultLists.book) ? 'disabled' : ''}`}>
                    <ListItem listIcon={bookIcon}>Books</ListItem>
                </Link>
                <Link to="/lists/manga" className={`link ${isListEmpty(defaultLists.manga) ? 'disabled' : ''}`}>
                    <ListItem listIcon={mangaIcon}>Mangas</ListItem>
                </Link>
                <Link to="/lists/movie" className={`link ${isListEmpty(defaultLists.movie) ? 'disabled' : ''}`}>
                    <ListItem listIcon={movieIcon}>Movies</ListItem>
                </Link>
                <Link to="/lists/series" className={`link ${isListEmpty(defaultLists.series) ? 'disabled' : ''}`}>
                    <ListItem listIcon={seriesIcon}>Series</ListItem>
                </Link>
                <Link to="/lists/unknown" className={`link ${isListEmpty(defaultLists.unknown) ? 'disabled' : ''}`}>
                    <ListItem listIcon={unknownIcon}>Unknown</ListItem>
                </Link>
            </div>
        </div>
    );
};

export default DefaultLists;