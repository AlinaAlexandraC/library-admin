import ListItem from "../ListItem/ListItem";
import "./DefaultLists.css";
import animeIcon from "../../assets/icons/anime.svg";
import bookIcon from "../../assets/icons/book.svg";
import mangaIcon from "../../assets/icons/manga.svg";
import movieIcon from "../../assets/icons/movie.svg";
import seriesIcon from "../../assets/icons/series.svg";
import unknownIcon from "../../assets/icons/unknown.svg";
import { Link, useLocation } from "react-router";
import { useEffect, useState } from "react";
import { fetchData } from "../../services/apiService";

const DefaultLists = () => {
    const [defaultLists, setDefaultLists] = useState({
        anime: 0,
        book: 0,
        manga: 0,
        movie: 0,
        series: 0,
        unknown: 0
    });
    const location = useLocation();

    const fetchListsSummary = async () => {
        try {
            const lists = await fetchData("lists/");
            
            return lists.reduce((acc, list) => {
                acc[list.name.toLowerCase()] = list.titleCount;
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
                anime: listsData["anime"] || 0,
                book: listsData["book"] || 0,
                manga: listsData["manga"] || 0,
                movie: listsData["movie"] || 0,
                series: listsData["series"] || 0,
                unknown: listsData["unknown"] || 0
            });
        };

        fetchSummary();
    }, [location]);

    return (
        <div className="default-lists-container">
            <div className="default-lists-wrapper">
                <Link to="/titles/anime" className={`list-link ${defaultLists.anime === 0 ? 'disabled' : ''}`}>
                    <ListItem listIcon={animeIcon}>{`Animes (${defaultLists.anime})`}</ListItem>
                </Link>
                <Link to="/titles/book" className={`list-link ${defaultLists.book === 0 ? 'disabled' : ''}`}>
                    <ListItem listIcon={bookIcon}>{`Books (${defaultLists.book})`}</ListItem>
                </Link>
                <Link to="/titles/manga" className={`list-link ${defaultLists.manga === 0 ? 'disabled' : ''}`}>
                    <ListItem listIcon={mangaIcon}>{`Mangas (${defaultLists.manga})`}</ListItem>
                </Link>
                <Link to="/titles/movie" className={`list-link ${defaultLists.movie === 0 ? 'disabled' : ''}`}>
                    <ListItem listIcon={movieIcon}>{`Movies (${defaultLists.movie})`}</ListItem>
                </Link>
                <Link to="/titles/series" className={`list-link ${defaultLists.series === 0 ? 'disabled' : ''}`}>
                    <ListItem listIcon={seriesIcon}>{`Series (${defaultLists.series})`}</ListItem>
                </Link>
                <Link to="/titles/unknown" className={`list-link ${defaultLists.unknown === 0 ? 'disabled' : ''}`}>
                    <ListItem listIcon={unknownIcon}>{`Unknown (${defaultLists.unknown})`}</ListItem>
                </Link>
            </div>
        </div>
    );
};

export default DefaultLists;