import "./TitleItem.css";
import ItemButtons from "../ItemButtons/ItemButtons";

const TitleItem = ({ title, setTitles, openModal }) => {

    return (
        <div className="title-item-container">
            <div className="decoration"></div>
            <div className="title-details">
                <span className="title">{title.title}</span>
                <div className="other-details">
                    <div className="genre">{title.genre || ""}</div>
                    <div className="author">{title.author || ""}</div>
                    <div className="numberOfSeasons">{title.numberOfSeasons || null}</div>
                    <div className="numberOfEpisodes">{title.numberOfEpisodes || null}</div>
                    <div className="numberOfChapters">{title.numberOfChapters || null}</div>
                </div>
            </div>
            <ItemButtons title={title} setTitles={setTitles} openModal={openModal} />
        </div>
    );
};

export default TitleItem;