import bcryptjs from "bcryptjs";

import User from "../models/User.js";

export const SignUp = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password)
            return res.status(400).json({ message: "All fields are required" });

        const existingUser = await User.findOne({
            $or: [{ username }, { email }],
        });

        if (existingUser)
            return res.status(409).json({
                message: "Cannot create the account",
            });

        const hashedPassword = await bcryptjs.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        res.json({ message: "Sign up successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};
