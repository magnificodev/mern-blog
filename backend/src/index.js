import express from "express";
import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import UserRoutes from "./routes/users.routes.js";
import AuthRoutes from "./routes/auth.routes.js";
import PostRoutes from "./routes/posts.routes.js";
import CommentRoutes from "./routes/comments.routes.js";

const PORT = process.env.PORT_NUMBER || 3000;

// Load environment variables from .env file
dotenv.config();

// Connect the database
mongoose
    .connect(process.env.MONGODB_CONNECTION_STRING)
    .then(() => console.log("MongoDB is connected successfully"))
    .catch((err) => console.log(err));

const app = express();

// Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// App routes
app.use("/api/v1/auth", AuthRoutes);
app.use("/api/v1/users", UserRoutes);
app.use("/api/v1/posts", PostRoutes);
app.use("/api/v1/comments", CommentRoutes);
app.use("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// Error handling middlewares
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const status = err.status || "failure";
    const message = err.message || "Internal Server Error";

    res.status(statusCode).json({
        status,
        message,
    });
});

// Listen the upcoming requests
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
