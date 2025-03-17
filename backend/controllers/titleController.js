import User from "../models/User.js";
import Title from "../models/Title.js";
import admin from "../config/firebase.js";

// Add a title to the user's list

export const addTitleToUserList = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        const token = authHeader.split(" ")[1];
        const decodedToken = await admin.auth().verifyIdToken(token);
        const firebaseUid = decodedToken.uid;

        const { titles } = req.body;

        if (!titles || titles.length === 0) {
            return res.status(400).json({ message: "No titles provided." });
        }

        let user = await User.findOne({ firebaseUid });
        if (!user) return res.status(404).json({ message: "User not found." });

        const savedTitles = [];

        for (let titleData of titles) {
            const { title, type, genre, author, numberOfSeasons, numberOfEpisodes, numberOfChapters, status } = titleData;

            if (!title) {
                continue;
            }

            const newTitle = new Title({ title, type, genre, author, numberOfSeasons, numberOfEpisodes, numberOfChapters, status });
            const savedTitle = await newTitle.save();
            savedTitles.push(savedTitle);

            if (!user.titlesList) {
                user.titlesList = [];
            }

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
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        const token = authHeader.split(" ")[1];
        const decodedToken = await admin.auth().verifyIdToken(token);
        const firebaseUid = decodedToken.uid;

        const user = await User.findOne({ firebaseUid }).populate('titlesList.title_id');

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        if (user.titlesList.length === 0) {
            return res.status(404).json({ message: "No titles found for this user." });
        }

        const titles = user.titlesList.map(item => item.title_id);

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