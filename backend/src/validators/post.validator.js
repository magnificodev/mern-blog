import { body } from "express-validator";
import Post from "../models/post.model.js";

export const createValidator = [
    body("title").custom(async (value) => {
        const post = await Post.findOne({ title: value });
        if (post) {
            throw new Error("Title already exists");
        }
        if (/^\s*$|^$/.test(value)) {
            throw new Error("Title cannot be empty");
        }
        return true;
    }),
    body("content").custom((value) => {
        if (/^\s*$|^$/.test(value)) {
            throw new Error("Content cannot be empty");
        }
        return true;
    }),
];

export const updateValidator = [
    body("title").custom(async (value, { req }) => {
        const post = await Post.findOne({ title: value });
        if (post && post.id !== req.params.postId) {
            throw new Error("Title already exists");
        }
        if (/^\s*$|^$/.test(value)) {
            throw new Error("Title cannot be empty");
        }
        return true;
    }),
    body("content").custom((value) => {
        if (/^\s*$|^$/.test(value)) {
            throw new Error("Content cannot be empty");
        }
        return true;
    }),
];
