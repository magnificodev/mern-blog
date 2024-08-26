import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User.js";

export const SignUp = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                status: "failure",
                message: "All fields are required",
                data: {},
            }); // 400 Bad Request
        }
        const existingUser = await User.findOne({
            $or: [{ username }, { email }],
        });

        if (existingUser) {
            return res.status(409).json({
                status: "faluire",
                message: "Can not create the account for some reasons",
                data: {},
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
            message: "Sign up successfully",
            data: {},
        });
    } catch (err) {
        res.json({
            status: "failure",
            message: err.message,
            data: {},
        });
    }
};

export const SignIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                status: "failure",
                message: "All fields are required",
                data: {},
            });
        }

        const existingUser = await User.findOne({
            email,
        });

        if (!existingUser) {
            return res.status(404).json({
                status: "failure",
                message: "Your account doesn't exist",
                data: {},
            });
        }

        const isPasswordMatched = await bcryptjs.compare(
            password,
            existingUser.password
        );

        if (!isPasswordMatched) {
            return res.status(401).json({
                status: "failure",
                message: "Incorrect password. Please try again",
                data: {},
            });
        }

        const token = jwt.sign(
            { id: existingUser._id },
            process.env.JWT_SECRET_KEY
        );

        const { password: pass, ...rest } = existingUser._doc;

        res.status(200)
            .cookie("access_token", token, {
                httpOnly: true,
                maxAge: 1 * 60 * 60 * 1000,
            })
            .json({
                status: "success",
                message: "Sign in successfully",
                data: {
                    user: rest,
                },
            });
    } catch (err) {
        res.json({
            status: "failure",
            message: err.message,
            data: {},
        });
    }
};
