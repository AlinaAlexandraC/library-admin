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
    lists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'List' }],
    firebaseUid: {
        type: String,
        required: true,
        unique: true
    }
});

export default mongoose.model('User', UserSchema);