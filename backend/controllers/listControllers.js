import List from "../models/List.js";
import User from "../models/User.js";

export const getUserLists = async (req, res) => {
    try {
        const firebaseUid = req.user.uid;

        const user = await User.findOne({ firebaseUid }).populate("lists");

        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json(user.lists);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getListById = async (req, res) => {
    try {
        const firebaseUid = req.user.uid;
        const { listId } = req.params;

        const user = await User.findOne({ firebaseUid }).populate({
            path: "lists",
            populate: { path: "titles" }
        });

        if (!user) return res.status(404).json({ message: "User not found" });

        const list = user.lists.find(list => list._id.toString().toLowerCase() === listId.toLowerCase());

        if (!list) {
            return res.status(404).json({ message: "List not found" });
        }

        return res.status(200).json(list);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createList = async (req, res) => {
    try {
        const firebaseUid = req.user.uid;
        const { name } = req.body;

        if (!name) return res.status(400).json({ message: "List name is required." });

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

        const user = await User.findOne({ firebaseUid });

        if (!user) return res.status(404).json({ message: "User not found" });

        const listToDelete = user.lists.find(list => list._id.toString() === listId);

        if (!listToDelete) return res.status(404).json({ message: "List not found" });

        if (deleteTitles) {
            if (listToDelete.titles && listToDelete.titles.length > 0) {

                await List.findByIdAndDelete(listId);
                for (let list of user.lists) {
                    list.titles = list.titles.filter(title => title.listId.toString() !== listId);
                    await list.save();
                }

                return res.status(200).json({ message: "List and titles deleted successfully." });
            } else {
                await List.findByIdAndDelete(listId);
                return res.status(200).json({ message: "List and titles deleted successfully." });
            }

        } else {
            const defaultList = user.lists.find(list => list.name === "Default");

            if (!defaultList) {
                return res.status(400).json({ message: "No default list found." });
            }

            if (listToDelete.titles && listToDelete.titles.length > 0) {
                listToDelete.titles.forEach(title => {
                    defaultList.titles.push(title);
                });

                await defaultList.save();
            }

            user.lists = user.lists.filter(list => list._id.toString() !== listId);

            await user.save();

            return res.status(200).json({ message: "List deleted, titles moved to default list." });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};