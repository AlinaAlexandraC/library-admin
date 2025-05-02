import List from "../models/List.js";
import Title from "../models/Title.js";
import User from "../models/User.js";

export const getUserLists = async (req, res) => {
    try {
        const firebaseUid = req.user.uid;

        const user = await User.findOne({ firebaseUid }).populate({
            path: "lists",
            populate: { path: "titles.title_id" },
        });

        if (!user) return res.status(404).json({ message: "User not found" });

        for (let list of user.lists) {
            const originalCount = list.titles.length;
            list.titles = list.titles.filter(entry => entry.title_id != null);
            if (list.titles.length !== originalCount) {
                await list.save();
            }
        }

        const listsSummary = user.lists ? user.lists.map(list => ({
            _id: list._id,
            name: list.name,
            titleCount: list.titles?.length || 0,
            titles: list.titles || []
        })) : [];

        res.status(200).json(listsSummary);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createList = async (req, res) => {
    try {
        const firebaseUid = req.user.uid;
        const { name } = req.body;

        if (!name) return res.status(400).json({ message: "List name is required." });

        const reservedNames = ["Anime", "Book", "Manga", "Movie", "Series", "Unknown"];

        if (reservedNames.includes(name.trim().toLowerCase())) {
            return res.status(400).json({ message: "This list name is reserved and cannot be used." });
        }

        const user = await User.findOne({ firebaseUid });

        if (!user) return res.status(404).json({ message: "User not found" });

        const newList = new List({ userId: user._id, name });
        const savedList = await newList.save();

        user.lists.push(savedList._id);
        await user.save();

        res.status(201).json(savedList);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateList = async (req, res) => {
    try {
        const firebaseUid = req.user.uid;
        const { listId, name } = req.body;

        if (!listId || !name) {
            return res.status(400).json({ message: "List ID and new name are required" });
        }

        const user = await User.findOne({ firebaseUid });
        if (!user) return res.status(404).json({ message: "User not found" });

        const list = await List.findOne({ _id: listId, userId: user._id });

        if (!list) return res.status(404).json({ message: "List not found" });

        list.name = name;
        await list.save();

        res.status(200).json(list);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteList = async (req, res) => {
    try {
        const firebaseUid = req.user.uid;
        const { listId, deleteTitles } = req.body;

        if (!listId) return res.status(400).json({ message: "Missing listId" });

        const user = await User.findOne({ firebaseUid }).populate({
            path: "lists",
            populate: { path: "titles.title_id" }
        });

        if (!user) return res.status(404).json({ message: "User not found" });

        const listToDelete = user.lists.find(list => list._id.toString() === listId);

        if (!listToDelete) return res.status(404).json({ message: "List not found" });

        if (deleteTitles) {
            const titleIds = listToDelete.titles.map(title => title._id);
            await Title.deleteMany({ _id: { $in: titleIds } });
        } else if (listToDelete.titles.length > 0) {
            const listsByName = Object.fromEntries(user.lists.map(list => [list.name, list]));

            for (const title of listToDelete.titles) {
                let titleToMove = await Title.findOne({ _id: title.title_id });

                const type = titleToMove.type || "Unknown";

                let defaultList = listsByName[type];

                if (!defaultList) {
                    defaultList = new List({ userId: user._id, name: type, titles: [] });

                    await defaultList.save();

                    user.lists.push(defaultList._id);
                    listsByName[type] = defaultList;
                }

                defaultList.titles.push({ title_id: title.title_id, dateAdded: new Date() });

                await defaultList.save();
            }
        }

        await List.findByIdAndDelete(listId);

        user.lists = user.lists.filter(list => list._id.toString() !== listId);
        await user.save();

        res.status(200).json({
            message: deleteTitles
                ? "List and its titles deleted successfully."
                : "List deleted. Titles moved to default list(s).",
            success: true
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteListAndTitles = async (req, res) => {
    try {
        const firebaseUid = req.user.uid;
        const { listId } = req.body;

        const user = await User.findOne({ firebaseUid });

        if (!user) return res.status(404).json({ message: "User not found" });

        const list = await List.findById(listId).populate("titles.title_id");
        if (!list) return res.status(404).json({ message: "List not found" });

        const titleIds = list.titles.map(t => t.title_id?._id).filter(Boolean);

        await Title.deleteMany({ _id: { $in: titleIds } });

        await List.findByIdAndDelete(listId);

        user.lists = user.lists.filter(l => l._id.toString() !== listId);
        await user.save();

        res.status(200).json({ message: "List and its titles deleted successfully.", success: true });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};