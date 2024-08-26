import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser"

import UserRoute from "./routes/UserRoute.js";
import AuthRoute from "./routes/AuthRoute.js";

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
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// App routes
app.use("/api/user", UserRoute);
app.use("/api/auth", AuthRoute);

// Listen the upcoming requests
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
