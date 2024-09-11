import jwt from "jsonwebtoken";
import { MyError } from "../utils/error.handler.js";

const verifyToken = async (req, res, next) => {
    try {
        const token = req.cookies["accessToken"];
        if (!token) return next(new MyError(401, "Unauthorized"));

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.userId = decoded.userId;

        next();
    } catch (err) {
        next(err);
    }
};

export default verifyToken;
