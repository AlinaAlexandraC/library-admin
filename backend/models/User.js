import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    titlesList: [
        {
            title_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Title' },
            dateAdded: {
                type: Date,
                default: Date.now
            }
        }
    ],
    firebaseUid: {
        type: String,
        required: true,
        unique: true
    }
});

export default mongoose.model('User', UserSchema);