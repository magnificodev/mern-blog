import { body } from "express-validator";

export const createValidator = [
    body("title").notEmpty().withMessage("All fields are required"),
    body("content").notEmpty().withMessage("All fields are required"),
];
