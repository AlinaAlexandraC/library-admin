import "./ListItem.css";

const ListItem = ({ children, listIcon }) => {
    return (
        <div className="list-item-container">
            <img src={listIcon} alt="list-icon" className="list-icon" />
            {children}
        </div>
    );
};

export default ListItem;