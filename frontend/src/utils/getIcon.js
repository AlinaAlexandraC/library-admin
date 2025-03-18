import animeIcon from "../assets/icons/anime.svg";
import bookIcon from "../assets/icons/book.svg";
import seriesIcon from "../assets/icons/series.svg";
import movieIcon from "../assets/icons/movie.svg";
import mangaIcon from "../assets/icons/manga.svg";
import unknownIcon from "../assets/icons/unknown.svg";

const getIcon = (type) => {
    switch (type) {
        case 'Anime':
            return animeIcon;
        case 'Book':
            return bookIcon;
        case 'Movie':
            return movieIcon;
        case 'Series':
            return seriesIcon;
        case 'Manga':
            return mangaIcon;
        default:
            return unknownIcon;
    }
};

export default getIcon;