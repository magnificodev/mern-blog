import { MyError } from "../utils/error.handler.js";
import Post from "../models/post.model.js";
import { validationResult } from "express-validator";
import slugify from "slugify";

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

        const slug = slugify(req.body.title, {
            lower: true,
            strict: true,
            locale: "vi",
        });

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

export const getPosts = async (req, res, next) => {
    try {
        const skip = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 5;
        const order = req.query.order === "asc" ? 1 : -1;

        const posts = await Post.find({
            ...(req.query.userId && { userId: req.query.userId }),
            ...(req.query.category && { category: req.query.category }),
            ...(req.query.slug && { slug: req.query.slug }),
            ...(req.query.postId && { _id: req.query.postId }),
            ...(req.query.searchTerm && {
                $or: [
                    { title: { $regex: req.query.searchTerm, $option: "i" } },
                    { content: { $regex: req.query.searchTerm, $option: "i" } },
                ],
            }),
        })
            .skip(skip)
            .limit(limit)
            .sort({ updatedAt: order });

        const totalPosts = await Post.countDocuments();

        const now = new Date();

        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        );

        const lastMonthPosts = await Post.countDocuments({
            createdAt: { $gte: oneMonthAgo },
        });

        res.status(200).json({
            status: "success",
            message: "Get all the posts successfully!",
            data: {
                posts,
                totalPosts,
                lastMonthPosts,
            },
        });
    } catch (err) {
        next(err);
    }
};
