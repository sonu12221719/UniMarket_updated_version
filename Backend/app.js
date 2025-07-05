import express from "express";
import dotenv from "dotenv";
import cors from "cors";
// import mongoose from "mongoose";

// Routes
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// API Routes
app.use("/api/auth", authRoutes);

// Health check route
app.get("/", (req, res) => {
    res.send("UniMarket API is running...");
});

export default app;
