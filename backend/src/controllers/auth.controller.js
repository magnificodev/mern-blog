import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import { validationResult } from "express-validator";

import User from "../models/user.model.js";
import { MyError } from "../utils/error.handler.js";

export const signUp = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return next(new MyError(400, errors.errors[0].msg));
        } // 400 Bad Request

        const { username, email, password } = req.body;

        const hashedPassword = await bcryptjs.hash(password, 10);

        await User.create({
            username,
            email,
            password: hashedPassword,
        });

        res.status(201).json({
            status: "success",
            message: "Sign up successfully",
            data: {},
        });
    } catch (err) {
        next(err);
    }
};

export const signIn = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return next(new MyError(400, errors.errors[0].msg));
        } // 400 Bad Request

        const { email, password } = req.body;

        const user = await User.findOne({
            email,
        });

        if (!user) {
            return next(new MyError(401, "User not found"));
        }

        const isPasswordMatched = await bcryptjs.compare(
            password,
            user.password
        );

        if (!isPasswordMatched) {
            return next(
                new MyError(401, "Incorrect password. Please try again")
            );
        } // 401 Unauthorized

        const accessToken = jwt.sign(
            { userId: user._id, isAdmin: user.isAdmin },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "15m" }
        );

        const refreshToken = jwt.sign(
            { userId: user._id, isAdmin: user.isAdmin },
            process.env.JWT_REFRESH_SECRET_KEY,
            { expiresIn: "7d" }
        );

        const { password: pass, ...rest } = user._doc;

        res.status(200)
            .cookie("accessToken", accessToken, {
                httpOnly: true,
                maxAge: 15 * 60 * 1000,
            })
            .cookie("refreshToken", refreshToken, {
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000,
            })
            .json({
                status: "success",
                message: "Sign in successfully",
                data: {
                    user: rest,
                },
            });
    } catch (err) {
        next(err);
    }
};

export const googleAuth = async (req, res, next) => {
    try {
        const { name, email, googlePhotoUrl } = req.body;

        const existingUser = await User.findOne({
            email,
        });

        if (existingUser) {
            const accessToken = jwt.sign(
                { userId: existingUser._id, isAdmin: existingUser.isAdmin },
                process.env.JWT_SECRET_KEY,
                { expiresIn: "15m" }
            );

            const refreshToken = jwt.sign(
                { userId: existingUser._id, isAdmin: existingUser.isAdmin },
                process.env.JWT_REFRESH_SECRET_KEY,
                { expiresIn: "7d" }
            );

            const { password: pass, ...rest } = existingUser._doc;
            res.status(200)
                .cookie("accessToken", accessToken, {
                    httpOnly: true,
                    maxAge: 15 * 60 * 1000,
                })
                .cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                })
                .json({
                    status: "success",
                    message: "Google auth successfully",
                    data: {
                        user: rest,
                    },
                });
        } else {
            const generatedPassword =
                Math.random().toString(36).slice(-8) +
                Math.random().toString(36).slice(-8);

            const hashedPassword = await bcryptjs.hash(generatedPassword, 10);

            const newUser = await User.create({
                username:
                    name.toLowerCase().split(" ").join("") +
                    Math.random().toString(9).slice(-4),
                email,
                password: hashedPassword,
                profilePic: googlePhotoUrl,
            });

            const accessToken = jwt.sign(
                { userId: newUser._id, isAdmin: newUser.isAdmin },
                process.env.JWT_SECRET_KEY,
                { expiresIn: "15m" }
            );

            const refreshToken = jwt.sign(
                { userId: newUser._id, isAdmin: newUser.isAdmin },
                process.env.JWT_REFRESH_SECRET_KEY,
                { expiresIn: "7d" }
            );

            const { password: pass, ...rest } = newUser._doc;
            res.status(200)
                .cookie("accessToken", accessToken, {
                    httpOnly: true,
                    maxAge: 15 * 60 * 1000,
                })
                .cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                })
                .json({
                    status: "success",
                    message: "Google auth successfully",
                    data: {
                        user: rest,
                    },
                });
        }
    } catch (err) {
        next(err);
    }
};

export const signOut = async (req, res, next) => {
    try {
        res.clearCookie("accessToken")
            .clearCookie("refreshToken")
            .status(200)
            .json({
                status: "success",
                message: "User has been signed out",
                data: {},
            });
    } catch (err) {
        next(err);
    }
};

export const refreshToken = async (req, res, next) => {
    try {
        const refreshToken = req.cookies["refreshToken"];
        if (!refreshToken) {
            return next(new MyError(401, "Unauthorized"));
        }

        jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET_KEY,
            (err, decoded) => {
                if (err) {
                    res.clearCookie("accessToken");
                    res.clearCookie("refreshToken");

                    if (err.name === "TokenExpiredError") {
                        console.log("Refresh token expired");
                        return next(
                            new MyError(
                                401,
                                "Session expired, please sign in again."
                            )
                        );
                    }
                    return next(new MyError(401, "Invalid refresh token"));
                }

                const accessToken = jwt.sign(
                    { userId: decoded.userId, isAdmin: decoded.isAdmin },
                    process.env.JWT_SECRET_KEY,
                    { expiresIn: "15m" }
                );

                res.status(200)
                    .cookie("accessToken", accessToken, {
                        httpOnly: true,
                        maxAge: 15 * 60 * 1000,
                    })
                    .json({
                        status: "success",
                        message: "Refresh token successfully",
                    });
            }
        );
    } catch (err) {
        next(err);
    }
};

export const checkAuth = async (req, res, next) => {
    try {
        const token = req.cookies["refreshToken"];
        if (!token) {
            return res.status(401).json({ isAuth: false });
        }

        jwt.verify(
            token,
            process.env.JWT_REFRESH_SECRET_KEY,
            (err, decoded) => {
                if (err) {
                    if (err.name === "TokenExpiredError") {
                        return res.status(401).json({ isAuth: false });
                    }
                    return res.status(401).json({ isAuth: false });
                }
                res.status(200).json({
                    isAuth: true,
                });
            }
        );
    } catch (err) {
        next(err);
    }
};
