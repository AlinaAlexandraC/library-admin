import mongoose from "mongoose";

const ListSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    titles: [
        {
            title_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Title' },
            dateAdded: {
                type: Date,
                default: Date.now
            }
        }
    ],
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('List', ListSchema);