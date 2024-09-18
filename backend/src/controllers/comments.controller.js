import Comment from "../models/comment.model.js";

export const createComment = async (req, res, next) => {
    try {
        const { comment, userId, postId } = req.body;

        if (userId !== req.userId)
            return next(
                new MyError(403, "You are not allowed to create this comment")
            );

        const newComment = new Comment({
            comment,
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
