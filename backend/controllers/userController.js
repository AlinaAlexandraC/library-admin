import User from "../models/User.js";

// Get user by Firebase UID

export const getUserByUid = async (req, res) => {
    try {
        const user = await User.findOne({ firebaseUid: req.params.uid });
        if (!user) return res.status(404).json({ message: "User not found." });
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update user details

export const updateUserDetails = async (req, res) => {
    try {
        const { firebaseUid } = req.user;
        const { firstName, lastName, email } = req.body;

        const user = await User.findOne({ firebaseUid });

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
        const { firebaseUid } = req.user;

        const user = await User.findOne({ firebaseUid });

        if (!user) return res.status(404).json({ message: "User not found." });

        await User.deleteOne({ firebaseUid });
        res.status(200).json({ message: "User deleted successfully." });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
