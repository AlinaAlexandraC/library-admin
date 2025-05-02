import User from "../models/User.js";
import Title from "../models/Title.js";
import List from "../models/List.js";

// Add a title to the user's list

export const addTitleToUserList = async (req, res) => {
    try {
        const firebaseUid = req.user.uid;
        const { titles, listId, selectedType } = req.body;

        if (!titles || titles.length === 0) return res.status(400).json({ message: "No titles provided." });

        let user = await User.findOne({ firebaseUid }).populate({
            path: "lists",
            populate: { path: "titles.title_id" },
        });

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

        list.titles = list.titles.filter(entry => entry.title_id != null);
        await list.save();

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

        const list = user.lists.find(list => list.name.toLowerCase() === listId.toLowerCase())
            || user.lists.find(list => list._id.toString() === listId);

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
        const { title_id, updatedData, newListId } = req.body;

        const user = await User.findOne({ firebaseUid })
            .populate({
                path: "lists",
                populate: { path: "titles.title_id" },
            });

        if (!user) return res.status(404).json({ message: "User not found." });

        const defaultListNames = ["Anime", "Movie", "Manga", "Series", "Book", "Unknown"];

        let currentList = null;
        let titleEntry = null;
        const changes = [];

        for (let list of user.lists) {
            const foundEntry = list.titles.find(entry =>
                entry.title_id && entry.title_id._id.toString() === title_id
            );
            if (foundEntry) {
                currentList = list;
                titleEntry = foundEntry;
                break;
            }
        }

        if (!titleEntry || !currentList)
            return res.status(404).json({ message: "Title not found in user's list." });

        const updatedTitle = await Title.findByIdAndUpdate(title_id, updatedData, { new: true });

        if (!updatedTitle) return res.status(404).json({ message: "Title not found." });

        currentList.titles = currentList.titles.filter(
            entry => entry.title_id._id.toString() !== title_id
        );
        await currentList.save();

        let targetList = null;

        if (newListId) {
            targetList = user.lists.find(list => list._id.toString() === newListId);
            if (!targetList) {
                return res.status(404).json({ message: "Target custom list not found." });
            }
            changes.push(`Moved to custom list "${targetList.name}".`);
        } else if (
            updatedTitle.type &&
            defaultListNames.includes(updatedTitle.type)
        ) {
            targetList = user.lists.find(list => list.name === updatedTitle.type);

            if (!targetList) {
                targetList = new List({ name: updatedTitle.type, userId: user._id, titles: [] });
                await targetList.save();
                user.lists.push(targetList._id);
                await user.save();
            }
            changes.push(`Moved to default list "${targetList.name}".`);
        } else {
            targetList = user.lists.find(list => list.name === "Unknown");

            if (!targetList) {
                targetList = new List({ name: "Unknown", userId: user._id, titles: [] });
                await targetList.save();
                user.lists.push(targetList._id);
                await user.save();
            }
            changes.push(`Moved to "Unknown" list.`);
        }

        const alreadyInTarget = targetList.titles.some(
            entry => entry.title_id.toString() === updatedTitle._id.toString()
        );
        if (!alreadyInTarget) {
            targetList.titles.push({ title_id: updatedTitle._id, dateAdded: new Date() });
            await targetList.save();
        }

        res.status(200).json({
            success: true,
            updatedTitle,
            message: changes.length > 0 ? changes.join(" ") : "Title updated with no list move."
        });
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