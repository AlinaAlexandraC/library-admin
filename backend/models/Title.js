import mongoose from "mongoose";

const TitleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ["Anime", "Book", "Manga", "Movie", "Series"],
        required: false
    },
    genre: {
        type: String,
        enum: ["Isekai", "Shonen", "Mecha", "Slice of Life", "Romance", "Ecchi", "Other"],
        required: false
    },
    author: {
        type: String,
        required: false
    },
    numberOfSeasons: {
        type: Number,
        required: false
    },
    numberOfEpisodes: {
        type: Number,
        required: false
    },
    numberOfChapters: {
        type: Number,
        required: false
    },
    status: {
        type: Boolean,
        default: false,
    }
});

export default mongoose.model('Title', TitleSchema);