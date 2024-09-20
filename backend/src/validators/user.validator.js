import { body } from "express-validator";
import User from "../models/user.model.js";

export const updateValidator = [
    body("username")
        .optional()
        .custom((value) => {
            if (/^\s*$|^$/.test(value)) {
                throw new Error("Username cannot be empty");
            }
            return true;
        })
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
    body("email").custom((value) => {
        if (/^\s*$|^$/.test(value) || value) {
            throw new Error("Email is not allowed to be updated");
        }
        return true;
    }),
    body("password")
        .optional()
        .custom((value) => {
            if (/^\s*$|^$/.test(value)) {
                throw new Error("Password cannot be empty");
            }
            return true;
        })
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),
    body("profilePic")
        .optional()
        .custom((value) => {
            if (/^\s*$|^$/.test(value)) {
                throw new Error("Profile picture cannot be empty");
            }
            return true;
        }),
];
