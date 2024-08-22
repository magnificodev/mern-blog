import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

import UserRoute from "./routes/UserRoute.js";

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


// App routes
app.use("/api/user/", UserRoute);


// Listen the upcoming requests
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
