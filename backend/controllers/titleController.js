import User from "../models/User.js";
import Title from "../models/Title.js";

// Add a title to the user's list

export const addTitleToUserList = async (req, res) => {
    try {
        const { firebaseUid, title_id } = req.body;
        const user = await User.findOne({ firebaseUid });

        if (!user) return res.status(404).json({ message: "User not found." });

        if (user.titlesList.some(item => item.title.id.toString() === title_id)) {
            return res.status(400).json({ message: "Title is already in the list." });
        }

        user.titlesList.push({ title_id, dateAdded: new Date() });
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all titles

export const getTitles = async (req, res) => {
    try {
        const titles = await Title.find();
        res.status(200).json(titles);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get a single title by its ID

export const getTitleById = async (req, res) => {
    try {
        const title = await Title.findById(req.params.id);
        if (!title) return res.status(404).json({ message: "No titles found." });
        res.status(200).json(title);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update a title

export const updateTitle = async (req, res) => {
    try {
        const { firebaseUid, title_id, updatedData } = req.body;
        const user = await User.findOne({ firebaseUid });

        if (!user) return res.status(404).json({ message: "User not found." });

        const titleIndex = user.titlesList.findIndex(item => item.title_id.toString() === title_id);

        if (titleIndex === -1) return res.status(404).json({ message: "Title not found in list." });

        Object.assign(user.titlesList[titleIndex], updatedData);
        await user.save();

        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a title

export const deleteTitle = async (req, res) => {
    try {
        const { firebaseUid, title_id } = req.body;
        const user = await User.findOne({ firebaseUid });

        if (!user) return res.status(404).json({ message: "User not found." });

        user.titlesList = user.titlesList.filter(item => item.title_id.toString() !== title_id);
        await user.save();
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};