import bcryptjs from "bcryptjs";

import User from "../models/User.js";

export const SignUp = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                status: "failure",
                data: {
                    message: "All fields are required",
                },
            }); // 400 Bad Request
        }
        const existingUser = await User.findOne({
            $or: [{ username }, { email }],
        });

        if (existingUser) {
            return res.status(409).json({
                status: "faluire",
                data: {
                    message: "Can not create the account for some reasons",
                },
            });
        } // 409 Conflict

        const hashedPassword = await bcryptjs.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        res.json({
            status: "success",
            data: {
                message: "Sign up successfully",
            },
        });
    } catch (err) {
        res.json({
            status: "failure",
            data: {
                message: err.message,
            },
        });
    }
};
