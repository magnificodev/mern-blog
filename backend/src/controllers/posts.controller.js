import { MyError } from "../utils/error.handler.js";
import Post from "../models/post.model.js";
import { validationResult } from "express-validator";

export const createPost = async (req, res, next) => {
    try {
        if (!req.isAdmin) {
            return next(
                new MyError(403, "You are not allowed to create a post")
            );
        }

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return next(new MyError(400, errors.errors[0].msg));
        } // 400 Bad Request

        const slug = req.body.title
            .split(" ")
            .join("-")
            .toLowerCase()
            .replace(/[^a-zA-Z0-9-]/g, "");

        const newPost = new Post({
            ...req.body,
            slug,
            userId: req.userId,
        });

        await newPost.save();

        res.status(201).json({
            status: "success",
            message: "You post has been published!",
            data: {
                post: newPost._doc,
            },
        });
    } catch (err) {
        next(err);
    }
};
