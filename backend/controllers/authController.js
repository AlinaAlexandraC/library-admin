import admin from "../config/firebase.js";
import Session from "../models/Session.js";
import User from "../models/User.js";
import List from "../models/List.js";

const DEFAULT_LIST_NAMES = ["Anime", "Movie", "Manga", "Series", "Book", "Unknown"];

export const registerUser = async (req, res) => {
    const { email, password, firstName, lastName } = req.body;

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "Email is already in use" });
        }

        const userCredential = await admin.auth().createUser({
            email,
            password
        });

        const firebaseUid = userCredential.uid;

        const newUser = new User({
            firstName,
            lastName,
            email,
            firebaseUid,
            lists: []
        });

        try {
            await newUser.save();

            for (const listName of DEFAULT_LIST_NAMES) {
                const list = new List({
                    userId: newUser._id,
                    name: listName,
                    titles: []
                });
                await list.save();
                newUser.lists.push(list._id);
            }

            await newUser.save();

            return res.status(201).json({ message: "User registered successfully", user: newUser });
        } catch (mongoError) {
            if (process.env.NODE_ENV === 'development') {
                console.error("MongoDB Error:", mongoError);
            }

            return res.status(500).json({ message: "Error saving user to MongoDB" });
        }
    } catch (error) {
        return res.status(400).json({ message: error.message || "Registration failed" });
    }
};

// Login user

export const loginUser = async (req, res) => {
    const { token } = req.body;

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        const firebaseUid = decodedToken.uid;

        const user = await User.findOne({ firebaseUid });

        if (!user) return res.status(404).json({ message: "User not found. Please check your credentials and try again." });

        const session = new Session({ userId: user._id, firebaseUid, token });
        await session.save();

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 24 * 60 * 60 * 1000
        });

        return res.status(200).json({ message: "Login successful", user });
    } catch (error) {
        return res.status(400).json({ message: "Invalid token. Please login again." });
    }
};

// Logout user

export const logoutUser = async (req, res) => {
    const token = req.cookies.token;

    try {
        if (token) {
            await Session.deleteOne({ token });
            res.clearCookie("token");
        }

        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: "Logout failed" });
    }
};

// Reset password

export const checkIfEmailExists = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) return res.status(400).json({ message: "Email is required" });

        const user = await User.findOne({ email: email.toLowerCase() });

        return res.json({ emailExists: !!user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error checking email' });
    }
};