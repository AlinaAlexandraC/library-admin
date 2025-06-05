import "./TitleItem.css";
import ItemButtons from "../ItemButtons/ItemButtons";
import { getColorByType } from "../../utils/getColorByType";

const TitleItem = ({ title, index, openModal, onToggleStatus, onDelete, loadingAction }) => {
    return (
        <div className="title-item-container">
            <div className="decoration" style={{ backgroundColor: getColorByType(title.type) }}></div>
            <div className={(title.genre || title.author || title.numberOfSeasons || title.numberOfEpisodes || title.numberOfChapters) ? "title-details" : "title-only"}>
                <div className={(title.genre || title.author || title.numberOfSeasons || title.numberOfEpisodes || title.numberOfChapters) ? "title-item-name" : "title-item-name-only"}>
                    <span className="index">{index}.</span>
                    <span className="filename">{title.title}</span>
                </div>
                <div className={(title.genre || title.author || title.numberOfSeasons || title.numberOfEpisodes || title.numberOfChapters) ? "other-details" : "no-details"}>
                    <span className="genre">{title.genre || ""}</span>
                    {title.type === "Book" && (
                        <span className="author"> Written by <i>{title.author || ""}</i></span>
                    )}
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
            <ItemButtons
                title={title}
                openModal={openModal}
                onToggleStatus={onToggleStatus}
                onDelete={onDelete}
                loadingAction={loadingAction}
            />
        </div>
    );
};

export default TitleItem;