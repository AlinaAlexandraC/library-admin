import User from "../models/User.js";
import Title from "../models/Title.js";
import admin from "../config/firebase.js";

// Add a title to the user's list

export const addTitleToUserList = async (req, res) => {
    try {
        const firebaseUid = req.user.uid;
        const { titles } = req.body;

        if (!titles || titles.length === 0) return res.status(400).json({ message: "No titles provided." });

        let user = await User.findOne({ firebaseUid });
        if (!user) return res.status(404).json({ message: "User not found." });

        const savedTitles = [];

        for (let titleData of titles) {
            const { title, type, genre, author, numberOfSeasons, numberOfEpisodes, numberOfChapters, status } = titleData;

            if (!title) continue;

            const newTitle = new Title({ title, type, genre, author, numberOfSeasons, numberOfEpisodes, numberOfChapters, status });
            const savedTitle = await newTitle.save();
            savedTitles.push(savedTitle);

            user.titlesList.push({ title_id: savedTitle._id, dateAdded: new Date() });
        }

        await user.save();
        res.status(201).json({ success: true, message: "Title added successfully!", title: savedTitles });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all titles

export const getTitles = async (req, res) => {
    try {
        const firebaseUid = req.user.uid;

        const user = await User.findOne({ firebaseUid }).populate('titlesList.title_id');

        if (!user) return res.status(404).json({ message: "User not found." });
        if (user.titlesList.length === 0) return res.status(404).json({ message: "No titles found for this user." });

        const titles = user.titlesList.map(item => item.title_id);

        res.status(200).json(titles);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update a title

export const updateTitle = async (req, res) => {
    try {
        const firebaseUid = req.user.uid;
        const { title_id, updatedData } = req.body;

        const user = await User.findOne({ firebaseUid }).populate("titlesList.title_id");

        if (!user) return res.status(404).json({ message: "User not found." });

        const titleEntry = user.titlesList.find(entry => entry.title_id._id.toString() === title_id);
        if (!titleEntry) return res.status(404).json({ message: "Title not found in user's list." });

        const updatedTitle = await Title.findByIdAndUpdate(title_id, updatedData, { new: true });
        if (!updatedTitle) return res.status(404).json({ message: "Title not found." });

        res.status(200).json({ message: "Title updated successfully", updatedTitle });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a title

export const deleteTitle = async (req, res) => {
    try {
        const firebaseUid = req.user.uid;
        const { title_id } = req.body;

        const user = await User.findOne({ firebaseUid });

        if (!user) return res.status(404).json({ message: "User not found." });

        user.titlesList = user.titlesList.filter(item => item.title_id.toString() !== title_id);
        await user.save();

        res.status(200).json({ message: "Title deleted successfully", user });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};