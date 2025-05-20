export const getColorByType = (type) => {
    switch (type) {
        case 'Anime':
            return "#FF6B6B";
        case 'Book':
            return "#3F51B5";
        case 'Movie':
            return "#3CB371";
        case 'Series':
            return "#00BCD4";
        case 'Manga':
            return "#F59E0B";
        default:
            return "blue";
    }
};