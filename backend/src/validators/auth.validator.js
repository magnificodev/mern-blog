import { body } from "express-validator";
import User from "../models/user.model.js";

export const signUpValidator = [
    body("username")
        .trim()
        .notEmpty()
        .withMessage("All fields are required")
        .isLength({ min: 4 })
        .withMessage("Username must be at least 4 characters")
        .matches(/^[A-Za-z0-9_]+$/)
        .withMessage(
            "Username can only include letters, numbers, and underscores"
        )
        .custom(async (value) => {
            const user = await User.findOne({ username: value });
            if (user) {
                throw new Error("Username already exists");
            }
        }),
    body("email")
        .trim()
        .notEmpty()
        .withMessage("All fields are required")
        .isEmail()
        .withMessage("Please enter a valid email")
        .custom(async (value) => {
            const user = await User.findOne({ email: value });
            if (user) {
                throw new Error("Email already exists");
            }
        }),
    body("password")
        .trim()
        .notEmpty()
        .withMessage("All fields are required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),
];

export const signInValidator = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("All fields are required")
        .isEmail()
        .withMessage("Please enter a valid email")
        .custom(async (value) => {
            const user = await User.findOne({ email: value });
            if (!user) {
                throw new Error("Your account doesn't exist");
            }
        }),
    body("password")
        .trim()
        .notEmpty()
        .withMessage("All fields are required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),
];
