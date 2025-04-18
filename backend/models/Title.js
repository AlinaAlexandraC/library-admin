import mongoose from "mongoose";

const TitleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ["", "Anime", "Book", "Manga", "Movie", "Series"],
        default: ""
    },
    genre: {
        type: String,
        enum: ["", "Isekai", "Shonen", "Mecha", "Slice of Life", "Romance", "Ecchi"],
        default: ""
    },
    author: {
        type: String,
        default: ""
    },
    numberOfSeasons: {
        type: Number,
        default: null
    },
    numberOfEpisodes: {
        type: Number,
        default: null
    },
    numberOfChapters: {
        type: Number,
        default: null
    },
    status: {
        type: Boolean,
        default: false,
    }
});

export default mongoose.model('Title', TitleSchema);