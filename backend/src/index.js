import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import UserRoute from "./routes/user.route.js";
import AuthRoute from "./routes/auth.route.js";

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
app.use("/api/user", UserRoute);
app.use("/api/auth", AuthRoute);

// Error handling middlewares
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const status = err.status;
    const message = err.message || "Internal Server Error";
    
    if (err.name === "MongoServerError" && err.code === 11000) {
        const fieldName = Object.keys(err.keyValue)[0];
        message = `${fieldName.slice(0, 1).toUpperCase() + fieldName.slice(1)} already exists`;
    }
    if (err.name === "ValidationError") {
        message = Object.values(err.errors)[0].message;
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
