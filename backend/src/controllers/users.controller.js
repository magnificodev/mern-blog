import { MyError } from "../utils/error.handler.js";
import User from "../models/user.model.js";
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
        const totalPages = Math.ceil(totalUsers / limit);

        res.status(200).json({
            status: "success",
            message: "Users fetched successfully",
            data: { users, totalPages },
        });
    } catch (err) {
        next(err);
    }
};

export const updateUser = async (req, res, next) => {
    try {
        if (req.userId !== req.params.userId)
            return next(
                new MyError(403, "You are not allowed to update this user")
            );

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return next(new MyError(400, errors.errors[0].msg));
        } // 400 Bad Request

        const { username, password, profilePic } = req.body;

        const hashedPassword = await brcyptjs.hash(password, 10);

        const updatedUser = await User.findByIdAndUpdate(
            req.params.userId,
            {
                $set: {
                    username,
                    password: hashedPassword,
                    profilePic,
                },
            },
            { new: true }
        );

        const { password: pass, ...rest } = updatedUser._doc;

        res.status(200).json({
            status: "success",
            message: "User has been updated!",
            data: {
                user: rest,
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

        res.status(200).json({
            status: "success",
            message: "User has been deleted!",
        });
    } catch (err) {
        next(err);
    }
};
