import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import UserRoutes from "./routes/users.route.js";
import AuthRoutes from "./routes/auth.route.js";
import PostRoutes from "./routes/posts.route.js";
import CommentRoutes from "./routes/comments.route.js";

// Constant variables
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

// App routes
app.use("/api/users", UserRoutes);
app.use("/api/auth", AuthRoutes);
app.use("/api/posts", PostRoutes);
app.use("/api/comments", CommentRoutes);

// Error handling middlewares
app.use((err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let status = err.status || "failure";
    let message = err.message || "Internal Server Error";

    if (err.name === "MongoServerError" && err.code === 11000) {
        const fieldName = Object.keys(err.keyValue)[0];
        message = `${
            fieldName.slice(0, 1).toUpperCase() + fieldName.slice(1)
        } already exists`;
        statusCode = 409;
    }
    if (err.name === "ValidationError") {
        message = Object.values(err.errors)[0].message;
        statusCode = 400;
    }
    res.status(statusCode).json({
        status,
        message,
    });
});

// Listen the upcoming requests
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
