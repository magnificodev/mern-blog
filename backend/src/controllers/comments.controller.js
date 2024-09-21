import Comment from "../models/comment.model.js";
import { MyError } from "../utils/error.handler.js";

export const getPostComments = async (req, res, next) => {
    try {
        const skip = parseInt(req.query.skip) || 0;
        const limit = parseInt(req.query.limit) || 5;
        const order = req.query.order === "asc" ? 1 : -1;

        const comments = await Comment.find({ postId: req.params.postId })
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: order });

        const totalComments = await Comment.countDocuments({
            postId: req.params.postId,
        });

        res.status(200).json({
            status: "success",
            data: {
                comments,
                totalComments,
            },
        });
    } catch (err) {
        next(err);
    }
};

export const getComments = async (req, res, next) => {
    try {
        const skip = parseInt(req.query.skip) || 0;
        const limit = parseInt(req.query.limit) || 5;
        const order = req.query.order === "asc" ? 1 : -1;

        const comments = await Comment.find()
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: order });

        const totalComments = await Comment.countDocuments();

        const now = new Date();

        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        );

        const lastMonthComments = await Comment.countDocuments({
            createdAt: { $gte: oneMonthAgo },
        });

        res.status(200).json({
            status: "success",
            data: {
                comments,
                totalComments,
                lastMonthComments,
            },
        });
    } catch (err) {
        next(err);
    }
};

export const createComment = async (req, res, next) => {
    try {
        const { content, userId, postId } = req.body;

        if (userId !== req.userId)
            return next(
                new MyError(403, "You are not allowed to create this comment")
            );

        const newComment = new Comment({
            content,
            userId,
            postId,
        });

        await newComment.save();

        res.status(201).json({
            status: "success",
            message: "Comment has been created!",
            data: {
                comment: newComment,
            },
        });
    } catch (err) {
        next(err);
    }
};

export const likeComment = async (req, res, next) => {
    try {
        const { userId } = req.body;
        const { commentId } = req.params;

        const comment = await Comment.findById(commentId);

        if (!comment) return next(new MyError(404, "Comment not found!"));

        if (comment.likes.includes(userId)) {
            comment.likes = comment.likes.filter((id) => id !== userId);
        } else {
            comment.likes.push(userId);
        }

        comment.numberOfLikes = comment.likes.length;

        await comment.save();

        res.status(200).json({
            status: "success",
            message: "Comment liked!",
            data: {
                comment,
            },
        });
    } catch (err) {
        next(err);
    }
};

export const editComment = async (req, res, next) => {
    try {
        const { content } = req.body;
        const { commentId } = req.params;

        const comment = await Comment.findById(commentId);

        if (!comment) return next(new MyError(404, "Comment not found!"));

        if (comment.userId !== req.userId)
            return next(
                new MyError(403, "You are not allowed to update this comment")
            );

        comment.content = content;
        await comment.save();

        res.status(200).json({
            status: "success",
            message: "Comment updated!",
            data: {
                comment,
            },
        });
    } catch (err) {
        next(err);
    }
};

export const updateComment = async (req, res, next) => {
    try {
        const { commentId } = req.params;
        const { content } = req.body;

        if (comment.userId !== req.userId)
            return next(
                new MyError(403, "You are not allowed to update this comment")
            );

        const comment = await Comment.findByIdAndUpdate(
            commentId,
            { content },
            { new: true }
        );

        res.status(200).json({
            status: "success",
            message: "Comment updated!",
            data: {
                comment,
            },
        });
    } catch (err) {
        next(err);
    }
};

export const deleteComment = async (req, res, next) => {
    try {
        const { commentId } = req.params;

        const comment = await Comment.findById(commentId);

        if (!comment) return next(new MyError(404, "Comment not found!"));

        if (comment.userId !== req.userId && !req.isAdmin)
            return next(
                new MyError(403, "You are not allowed to delete this comment")
            );

        await comment.deleteOne();

        res.status(200).json({
            status: "success",
            message: "Comment deleted!",
        });
    } catch (err) {
        next(err);
    }
};
