import { body } from "express-validator";

export const createValidator = [
    body("title").trim().notEmpty().withMessage("Title cannot be empty"),
    body("content").trim().notEmpty().withMessage("Content cannot be empty"),
];

export const updateValidator = [
    body("title").trim().notEmpty().withMessage("Title cannot be empty"),
    body("content").trim().notEmpty().withMessage("Content cannot be empty"),
];
