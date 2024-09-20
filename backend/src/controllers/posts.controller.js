import { MyError } from "../utils/error.handler.js";
import Post from "../models/post.model.js";
import { validationResult } from "express-validator";
import slugify from "slugify";

export const getPosts = async (req, res, next) => {
    try {
        const skip = parseInt(req.query.skip) || 0;
        const limit = parseInt(req.query.limit) || 5;
        const order = req.query.order === "asc" ? 1 : -1;

        const posts = await Post.find({
            ...(req.query.userId && { userId: req.query.userId }),
            ...(req.query.category && { category: req.query.category }),
            ...(req.query.slug && { slug: req.query.slug }),
            ...(req.query.searchTerm && {
                $or: [
                    { title: { $regex: req.query.searchTerm, $options: "i" } },
                    {
                        content: {
                            $regex: req.query.searchTerm,
                            $options: "i",
                        },
                    },
                ],
            }),
        })
            .skip(skip)
            .limit(limit)
            .sort({ updatedAt: order });

        if (posts.length === 0) {
            return next(new MyError(404, "Posts not found"));
        }

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

export const getPost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.postId);

        if (!post) {
            return next(new MyError(404, "Post not found"));
        }

        res.status(200).json({
            status: "success",
            message: "Get the post successfully!",
            data: {
                post,
            },
        });
    } catch (err) {
        next(err);
    }
};

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

        const newPost = await Post.create({
            ...req.body,
            slug,
            userId: req.userId,
        });

        res.status(201).json({
            status: "success",
            message: "Your post has been published!",
            data: {
                post: newPost._doc,
            },
        });
    } catch (err) {
        next(err);
    }
};

export const updatePost = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return next(new MyError(400, errors.errors[0].msg));
        } // 400 Bad Request

        const post = await Post.findById(req.params.postId);

        if (!post) {
            return next(new MyError(404, "Post not found"));
        }

        if (req.userId !== post.userId && !req.isAdmin) {
            return next(
                new MyError(403, "You are not allowed to update this post")
            );
        }

        const updatedPost = await Post.findByIdAndUpdate(
            req.params.postId,
            {
                ...req.body,
                slug: slugify(req.body.title, {
                    lower: true,
                    strict: true,
                    locale: "vi",
                }),
            },
            { new: true }
        );

        res.status(200).json({
            status: "success",
            message: "The post has been updated successfully",
            data: {
                post: updatedPost,
            },
        });
    } catch (err) {
        next(err);
    }
};

export const deletePost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.postId);

        if (!post) {
            return next(new MyError(404, "Post not found"));
        }

        if (req.userId !== post.userId && !req.isAdmin) {
            return next(
                new MyError(403, "You are not allowed to delete this post")
            );
        }

        await Post.findByIdAndDelete(req.params.postId);

        res.status(200).json({
            status: "success",
            message: "The post has been deleted successfully",
        });
    } catch (err) {
        next(err);
    }
};
