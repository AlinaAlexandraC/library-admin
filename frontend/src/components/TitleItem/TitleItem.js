import "./TitleItem.css";
import ItemButtons from "../ItemButtons/ItemButtons";

const TitleItem = ({ title, index, setTitles, openModal }) => {

    return (
        <div className="title-item-container">
            <div className="decoration"></div>
            <div className="title-details">
                <div className="title-item-name">
                    <span className="index">{index}.</span>
                    <span className="filename">{title.title}</span>
                </div>
                <div className="other-details">
                    <span className="genre">{title.genre || ""}</span>
                    <span className="author">{title.author || ""}</span>
                    {title.numberOfSeasons != null && (
                        <span className="numberOfSeasons">
                            {title.numberOfSeasons} {title.numberOfSeasons === 1 ? 'season' : 'seasons'}
                        </span>
                    )}
                    {title.numberOfEpisodes != null && (
                        <span className="numberOfEpisodes">
                            {title.numberOfEpisodes} {title.numberOfEpisodes === 1 ? 'episode' : 'episodes'}
                        </span>
                    )}
                    {title.numberOfChapters != null && (
                        <span className="numberOfChapters">
                            {title.numberOfChapters} {title.numberOfChapters === 1 ? 'chapter' : 'chapters'}
                        </span>
                    )}
                </div>
            </div>
            <ItemButtons title={title} setTitles={setTitles} openModal={openModal} />
        </div>
    );
};

export default TitleItem;