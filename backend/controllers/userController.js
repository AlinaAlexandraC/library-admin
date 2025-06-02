import User from "../models/User.js";
import List from "../models/List.js";
import Title from "../models/Title.js";
import Session from "../models/Session.js";
import admin from "../config/firebase.js";

// Get user by Firebase UID

export const getUserByUid = async (req, res) => {
    try {
        const user = await User.findOne({ firebaseUid: req.user.uid });
        if (!user) return res.status(404).json({ message: "User not found." });
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update user details

export const updateUserDetails = async (req, res) => {
    try {
        const { firstName, lastName, email } = req.body;

        const user = await User.findOne({ firebaseUid: req.user.uid });

        if (!user) return res.status(404).json({ message: "User not found." });

        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (email) user.email = email;

        await user.save();
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete user account

export const deleteUserAccount = async (req, res) => {
    try {
        const user = await User.findOne({ firebaseUid: req.user.uid });

        if (!user) return res.status(404).json({ message: "User not found." });

        const lists = await List.find({ userId: user._id });

        const titleIds = lists.flatMap(list =>
            list.titles.map(item => item.title_id).filter(Boolean)
        );

        if (titleIds.length > 0) {
            await Title.deleteMany({ _id: { $in: titleIds } });
        }

        await List.deleteMany({ userId: user._id });
        await Session.deleteMany({ userId: user._id });
        await User.deleteOne({ firebaseUid: req.user.uid });

        try {
            await admin.auth().deleteUser(req.user.uid);
        } catch (error) {
            console.error("Failed to delete user from Firebase:", error);
            return res.status(500).json({ message: 'Failed to delete user from Firebase.' });
        }

        return res.status(200).json({ message: "User and related data deleted successfully." });

    } catch (error) {
        console.error("Error during deletion:", error);
        return res.status(400).json({ message: error.message });
    }
};
