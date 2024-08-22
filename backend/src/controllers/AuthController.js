import bcryptjs from "bcryptjs";

import User from "../models/User.js";
import ErrorHandler from "../utils/ErrorHandler.js";

export const SignUp = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return next(ErrorHandler(400, "All fields are required"));
        }
        const existingUser = await User.findOne({
            $or: [{ username }, { email }],
        });

        if (existingUser)
            return next(
                ErrorHandler(409, "Can not create the account for some reasons")
            );

        const hashedPassword = await bcryptjs.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        await newUser.save();
        res.json({ message: "Sign up successfully" });
    } catch (error) {
        next(error);
    }
};
