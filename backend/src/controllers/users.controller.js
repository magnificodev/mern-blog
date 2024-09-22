import { MyError } from "../utils/error.handler.js";
import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import Comment from "../models/comment.model.js";
import brcyptjs from "bcryptjs";
import { validationResult } from "express-validator";

export const getUsers = async (req, res, next) => {
    try {
        if (!req.isAdmin)
            return next(new MyError(403, "You are not allowed to access this"));

        const skip = parseInt(req.query.skip) || 0;
        const limit = parseInt(req.query.limit) || 5;
        const order = req.query.order === "asc" ? 1 : -1;

        const users = await User.find()
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: order });

        const totalUsers = await User.countDocuments();

        const now = new Date();

        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        );
        const lastMonthUsers = await User.countDocuments({
            createdAt: { $gte: oneMonthAgo },
        });

        res.status(200).json({
            status: "success",
            message: "Users fetched successfully",
            data: { users, totalUsers, lastMonthUsers },
        });
    } catch (err) {
        next(err);
    }
};

export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.userId);

        const { password, ...rest } = user._doc;

        res.status(200).json({
            status: "success",
            message: "User fetched successfully",
            data: { user: rest },
        });
    } catch (err) {
        next(err);
    }
};

export const updateUser = async (req, res, next) => {
    try {
        if (req.userId !== req.params.userId) {
            return next(
                new MyError(403, "You are not allowed to update this user")
            );
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(new MyError(400, errors.errors[0].msg));
        }

        if (!req.body) {
            return next(new MyError(400, "No data to update"));
        }

        if (req.body.password) {
            req.body.password = await brcyptjs.hash(req.body.password, 10);
        }

        const { email, ...rest } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            req.params.userId,
            { $set: rest },
            { new: true }
        );

        const { password: _, ...userWithoutPassword } = updatedUser._doc;

        res.status(200).json({
            status: "success",
            message: "User has been updated successfully",
            data: {
                user: userWithoutPassword,
            },
        });
    } catch (err) {
        next(err);
    }
};

export const deleteUser = async (req, res, next) => {
    try {
        if (req.userId !== req.params.userId && !req.isAdmin)
            return next(
                new MyError(403, "You are not allowed to delete this user")
            );

        const deletedUser = await User.findById(req.params.userId);
        
        if (deletedUser.isAdmin) {
            return next(
                new MyError(403, "You are not allowed to delete an admin user")
            );
        }

        await User.findByIdAndDelete(req.params.userId);
        await Post.deleteMany({ userId: req.params.userId });
        await Comment.deleteMany({ userId: req.params.userId });
        await Comment.updateMany(
            { likes: req.params.userId },
            { $pull: { likes: req.params.userId } }
        );

        res.status(200).json({
            status: "success",
            message: "User has been deleted!",
        });
    } catch (err) {
        next(err);
    }
};
