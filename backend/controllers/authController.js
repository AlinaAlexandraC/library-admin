import admin from "../config/firebase.js";
import User from "../models/User.js";

// Register new user

export const registerUser = async (req, res) => {
    const { email, password, firstName, lastName } = req.body;

    try {
        const userCredential = await admin.auth().createUser({
            email,
            password
        });

        const firebaseUid = userCredential.uid;

        // Check if the user already exists by email or firebaseUid
        const existingUser = await User.findOne({ $or: [{ email }, { firebaseUid }] });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const newUser = new User({
            firstName,
            lastName,
            email,
            firebaseUid
        });

        try {
            await newUser.save();
            return res.status(201).json({ message: "User registered successfully", user: newUser });
        } catch (mongoError) {
            return res.status(400).json({ message: mongoError.message || "Error saving user to MongoDB" });
        }
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(400).json({ message: error.message });
    }
};

// Login user

export const loginUser = async (req, res) => {
    const { token } = req.body;

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        const firebaseUid = decodedToken.uid;

        const user = await User.findOne({ firebaseUid });

        if (!user) return res.status(404).json({ message: "User not found." });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 24 * 60 * 60 * 1000
        });

        res.status(200).json({ message: "Login successful", user });
    } catch (error) {
        res.status(400).json({ message: "Invalid token" });
    }
};

export const logoutUser = async (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        sameSite: "Strict",
        secure: process.env.NODE_ENV === "production"
    });
    res.status(200).json({ message: "Logged out successfully" });
};