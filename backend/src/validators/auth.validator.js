import { body } from "express-validator";

export const signUpValidator = [
    body("username")
        .notEmpty()
        .withMessage("All fields are required")
        .isLength({ min: 4 })
        .withMessage("Username must be at least 4 characters")
        .matches(/^[A-Za-z0-9_]+$/)
        .withMessage(
            "Username can only include letters, numbers, and underscores"
        ),
    body("email")
        .notEmpty()
        .withMessage("All fields are required")
        .isEmail()
        .withMessage("Please enter a valid email"),
    body("password")
        .notEmpty()
        .withMessage("All fields are required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),
];

export const signInValidator = [
    body("email")
        .notEmpty()
        .withMessage("All fields are required")
        .isEmail()
        .withMessage("Please enter a valid email"),
    body("password")
        .notEmpty()
        .withMessage("All fields are required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),
];