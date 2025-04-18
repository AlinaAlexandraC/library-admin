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