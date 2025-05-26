import User from "../models/User.js";
import Title from "../models/Title.js";

// Add a title to the user's list

export const addTitleToUserList = async (req, res) => {
    try {
        const firebaseUid = req.user.uid;
        const { titles, listId } = req.body;

        if (!titles || titles.length === 0) {
            return res.status(400).json({ message: "No titles provided." });
        }

        const user = await User.findOne({ firebaseUid }).populate({
            path: "lists",
            populate: { path: "titles.title_id" },
        });

        if (!user) return res.status(404).json({ message: "User not found." });

        const savedTitles = [];
        const duplicateTitles = [];

        const list = user.lists.find(
            l => l._id.toString() === listId || l.name.toLowerCase() === listId.toLowerCase()
        );

        if (!list) {
            return res.status(404).json({ message: "List not found. Please create it first." });
        }

        list.titles = list.titles.filter(entry => entry.title_id != null);
        await list.save();

        for (let titleData of titles) {
            const {
                title,
                type,
                genre,
                author,
                numberOfSeasons,
                numberOfEpisodes,
                numberOfChapters,
                status
            } = titleData;

            if (!title) continue;

            let newTitle = await Title.findOne({ title, type });

            if (!newTitle) {
                newTitle = new Title({
                    title,
                    type,
                    genre,
                    author,
                    numberOfSeasons,
                    numberOfEpisodes,
                    numberOfChapters,
                    status
                });
                await newTitle.save();
            }

            const isDuplicate = user.lists.some(userList =>
                userList.titles.some(entry =>
                    entry.title_id &&
                    entry.title_id.title === newTitle.title &&
                    entry.title_id.type === newTitle.type
                )
            );

            if (isDuplicate) {
                duplicateTitles.push(newTitle);
                continue;
            }

            list.titles.push({ title_id: newTitle._id, dateAdded: new Date() });
            savedTitles.push(newTitle);
        }

        await list.save();       

        return res.status(201).json({
            success: true,
            message: "Title(s) added successfully!",
            addedTitles: savedTitles,
            duplicates: duplicateTitles
        });

    } catch (error) {
        console.error("Error in addTitleToUserList:", error);
        return res.status(500).json({ message: error.message });
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

export const updateTitleDetails = async (req, res) => {
    try {
        const firebaseUid = req.user.uid;
        const { title_id, updatedData } = req.body;

        const user = await User.findOne({ firebaseUid });
        if (!user) return res.status(404).json({ message: "User not found." });

        const duplicate = await Title.findOne({
            title: updatedData.title,
            type: updatedData.type,
            _id: { $ne: title_id },
        });

        if (duplicate) {
            return res.status(400).json({ message: "This change would create a duplicate title in your library." });
        }

        const updatedTitle = await Title.findByIdAndUpdate(title_id, updatedData, { new: true });
        if (!updatedTitle) return res.status(404).json({ message: "Title not found." });

        res.status(200).json({
            success: true,
            updatedTitle,
            message: "Title details updated successfully.",
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

async function updateTitleList(title, currentList, targetList) {
    const filteredTitles = currentList.titles.filter(
        e => e.title_id?._id.toString() !== title._id.toString()
    );
    if (filteredTitles.length === currentList.titles.length) {
        throw new Error("Title entry not found in current list.");
    }

    currentList.titles = filteredTitles;
    await currentList.save();

    const duplicate = targetList.titles.find(e =>
        e.title_id?.title === title.title && e.title_id?.type === title.type
    );
    if (duplicate) throw new Error(`Duplicate title exists in list "${targetList.name}".`);

    targetList.titles.push({ title_id: title._id, dateAdded: new Date() });
    await targetList.save();

    return `Moved "${title.title}" to list "${targetList.name}".`;
}

export const moveTitleBetweenLists = async (req, res) => {
    try {
        const firebaseUid = req.user.uid;
        const { title_id, newListId } = req.body;

        const user = await User.findOne({ firebaseUid }).populate({
            path: "lists",
            populate: { path: "titles.title_id" },
        });

        if (!user) return res.status(404).json({ message: "User not found." });

        const title = await Title.findById(title_id);
        if (!title) return res.status(404).json({ message: "Title not found." });

        const currentList = user.lists.find(list =>
            list.titles.some(entry => entry.title_id?._id.toString() === title_id)
        );
        if (!currentList) return res.status(404).json({ message: "Title not found in any list." });

        if (!newListId || newListId === currentList._id.toString()) {
            return res.status(400).json({ message: "Invalid or same target list." });
        }

        const targetList = user.lists.find(list =>
            list._id.toString() === newListId || list.name === newListId
        );

        if (!targetList) {
            return res.status(404).json({ message: "Target list not found. Please create it first." });
        }

        const message = await updateTitleList(title, currentList, targetList);

        return res.status(200).json({ success: true, message });
    } catch (error) {
        return res.status(500).json({ message: error.message });
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