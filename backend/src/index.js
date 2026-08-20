import "dotenv/config"
// import dotenv from "dotenv";
// dotenv.config();
import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { clerkMiddleware } from "@clerk/express";
import connectDB from './lib/db.js'

const app = express()
const port = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

const publicDir = path.join(process.cwd(), 'public');

connectDB();

app.use(express.json());    // Middleware to parse JSON request bodies
app.use(cors({
    origin: FRONTEND_URL,
    credentials: true,
}));
app.use(clerkMiddleware());

// if the public directory exists, serve the static files
// this is for production build
if (fs.existsSync(publicDir)) {
    app.use(express.static(publicDir));
}

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})