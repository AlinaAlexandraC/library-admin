import cookieParser from 'cookie-parser';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

// Firebase Authentication

import authenticateToken from './middleware/authMiddleware.js';

// Route files

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import titleRoutes from './routes/titleRoutes.js';
import listRoutes from './routes/listRoutes.js';

// Load enviroment variables

dotenv.config();

const app = express();
app.use(cookieParser());

// Middleware

const allowedOrigins = ['https://library-admin-1.onrender.com', 'http://localhost:3000'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// Connect to MongoDB

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.log("MongoDB connection error:", error));

// Routes

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: "Server is awake" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", authenticateToken, userRoutes);
app.use("/api/titles", authenticateToken, titleRoutes);
app.use("/api/lists", authenticateToken, listRoutes);

// Root route

app.get("/", (req, res) => {
  res.send("Otaku Library API is running...");
});

// Serve frontend static files 

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "client", "build")));

// Catch-all route for frontend routing

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

// Start the server

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}/`));