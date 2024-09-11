import { body } from "express-validator";

export const updateValidator = [
    body("username")
        .optional({ checkFalsy: true })
        .isLength({ min: 4 })
        .withMessage("Username must be at least 4 characters")
        .matches(/^[A-Za-z0-9_]+$/)
        .withMessage(
            "Username can only include letters, numbers, and underscores"
        ),
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password")
        .optional({ checkFalsy: true })
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),
];
