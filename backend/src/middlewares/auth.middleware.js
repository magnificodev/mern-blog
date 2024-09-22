import jwt from "jsonwebtoken";
import { MyError } from "../utils/error.handler.js";

const verifyToken = async (req, res, next) => {
    try {
        const token = req.cookies["accessToken"];
        if (!token) return next(new MyError(401, "Unauthorized"));

        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
            if (err) {
                res.clearCookie("accessToken");
                if (err.name === "TokenExpiredError") {
                    console.log("Access token expired");
                    return next(new MyError(401, "Access token expired"));
                }
                return next(new MyError(401, "Invalid access token"));
            }
            req.userId = decoded.userId;
            req.isAdmin = decoded.isAdmin;
            next();
        });
    } catch (err) {
        next(err);
    }
};

export default verifyToken;
