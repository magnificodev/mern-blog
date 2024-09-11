import { MyError } from "../utils/error.handler.js";
import User from "../models/user.model.js";
import brcyptjs from "bcryptjs";
import { validationResult } from "express-validator";

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

        const { username, email, password, profilePic } = req.body;

        const isExist = await User.findOne({
            $and: [{ username }, { _id: { $ne: req.userId } }],
        });
        if (isExist)
            return next(
                new MyError(409, "Username has been used, please try another")
            );

        const hashedPassword = await brcyptjs.hash(password, 10);

        const updatedUser = await User.findByIdAndUpdate(
            req.params.userId,
            {
                $set: {
                    username,
                    email,
                    password: hashedPassword,
                    profilePic,
                },
            },
            { new: true }
        );

        const { password: pass, ...rest } = updatedUser._doc;

        res.status(200).json({
            status: "success",
            message: "User was updated successfully!",
            data: {
                user: rest,
            },
        });
    } catch (err) {
        next(err);
    }
};
