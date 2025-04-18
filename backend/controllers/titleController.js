import User from "../models/User.js";
import Title from "../models/Title.js";
import List from "../models/List.js";

// Add a title to the user's list

export const addTitleToUserList = async (req, res) => {
    try {
        const firebaseUid = req.user.uid;
        const { titles, listId, selectedType } = req.body;

        if (!titles || titles.length === 0) return res.status(400).json({ message: "No titles provided." });

        let user = await User.findOne({ firebaseUid }).populate('lists');
        if (!user) return res.status(404).json({ message: "User not found." });

        const savedTitles = [];
        let list;

        const defaultListNames = ["Anime", "Movie", "Manga", "Series", "Book", "Unknown"];

        if (!defaultListNames.includes(listId)) {
            list = await List.findOne({ _id: listId, userId: user._id });
        } else {
            const listName = selectedType != "" ? selectedType : "Unknown";

            list = await List.findOne({ name: listName, userId: user._id });

            if (!list) {
                list = new List({
                    name: listName,
                    userId: user._id
                });

                await list.save();

                if (!user.lists.includes(list._id)) {
                    user.lists.push(list._id);
                    await user.save();
                }
            }
        }

        for (let titleData of titles) {
            const { title, type, genre, author, numberOfSeasons, numberOfEpisodes, numberOfChapters, status } = titleData;

            if (!title) continue;

            const existingTitle = await Title.findOne({ title, type });
            let newTitle;

            if (existingTitle) {
                newTitle = existingTitle;
            } else {
                newTitle = new Title({ title, type, genre, author, numberOfSeasons, numberOfEpisodes, numberOfChapters, status });
                newTitle = await newTitle.save();
            }

            const titleAlreadyInList = list.titles.some(item => item.title_id.toString() === newTitle._id.toString());

            if (!titleAlreadyInList) {
                list.titles.push({ title_id: newTitle._id, dateAdded: new Date() });
            }

            savedTitles.push(newTitle);
        }

        await list.save();

        res.status(201).json({ success: true, message: "Title added successfully!", title: savedTitles });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all titles

export const getTitles = async (req, res) => {
    try {
        const firebaseUid = req.user.uid;
        const { listId } = req.params;

        const user = await User.findOne({ firebaseUid })
            .populate({
                path: "lists",
                populate: { path: "titles.title_id" },
            });

        if (!user) return res.status(404).json({ message: "User not found." });

        const list = user.lists.find(list => list.name.toLowerCase() === listId.toLowerCase());

        if (!list || list.titles.length === 0) {
            return res.status(404).json({ message: "No titles found for this list." });
        }

        const titles = list.titles
            .map(item => item.title_id)
            .filter(Boolean);

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

        const user = await User.findOne({ firebaseUid })
            .populate({
                path: "lists",
                populate: { path: "titles.title_id" },
            });

        if (!user) return res.status(404).json({ message: "User not found." });

        let titleEntry;

        for (let list of user.lists) {
            titleEntry = list.titles.find(entry => entry.title_id._id.toString() === title_id);

            if (titleEntry) break;
        }

        if (!titleEntry) return res.status(404).json({ message: "Title not found in user's list." });

        const updatedTitle = await Title.findByIdAndUpdate(title_id, updatedData, { new: true });

        if (!updatedTitle) return res.status(404).json({ message: "Title not found." });

        res.status(200).json({ updatedTitle });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a title

export const deleteTitle = async (req, res) => {
    try {
        const firebaseUid = req.user.uid;
        const { title_id } = req.body;

        const user = await User.findOne({ firebaseUid })
            .populate({
                path: "lists",
                populate: {
                    path: "titles.title_id"
                }
            });

        if (!user) return res.status(404).json({ message: "User not found." });

        for (let list of user.lists) {
            list.titles = list.titles.filter(item => item.title_id);

            await list.save();
        }

        await Title.findByIdAndDelete(title_id);

        res.status(200).json({ message: "Title deleted successfully", user });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};