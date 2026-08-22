import "dotenv/config"
// import dotenv from "dotenv";
// dotenv.config();
import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { clerkMiddleware } from "@clerk/express";
import connectDB from './lib/db.js'
import job from './lib/cron.js'
import clerkWebhook from './webhooks/clerk.webhook.js'
import authRoutes from './routes/auth.route.js'
import messageRoutes from './routes/message.route.js'

import { app, server } from './lib/socket.js'

const port = process.env.PORT;
const FRONTEND_URL = process.env.VITE_FRONTEND_URL || 'http://localhost:5173';

const publicDir = path.join(process.cwd(), 'public');

// it's important that you don't parse the webhook event data, it should be in the raw format
app.use("/api/webhooks/clerk", express.raw({ type: 'application/json' }), clerkWebhook)

app.use(express.json());    // Middleware to parse JSON request bodies
app.use(cors({
    origin: FRONTEND_URL,
    credentials: true,
}));
app.use(clerkMiddleware());

app.get('/health', (req, res) => {
    res.status(200).json({ ok: true })
})

app.use('/api/auth', authRoutes)
app.use('/api/messages', messageRoutes)

// if the public directory exists, serve the static files
// this is for production build
if (fs.existsSync(publicDir)) {
    app.use(express.static(publicDir));

    app.get("/{*any}", (req, res, next) => {
        res.sendFile(path.join(publicDir, 'index.html'), (err) => next(err));
    })
}

app.listen(port, () => {
    connectDB();

    console.log(`Server is running on port ${port}`);

    if (process.env.NODE_ENV === "production") {
        job.start();
    }
})