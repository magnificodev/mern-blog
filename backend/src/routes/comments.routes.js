import express from "express";
import verifyToken from "../middlewares/auth.middleware.js";
import {
    createComment,
    getPostComments,
    getComments,
    likeComment,
    deleteComment,
    editComment,
} from "../controllers/comments.controller.js";

const router = express.Router();

router.get("/", getComments);
router.get("/:postId", getPostComments);
router.post("/", verifyToken, createComment);
router.patch("/:commentId/likes", verifyToken, likeComment);
router.patch("/:commentId", verifyToken, editComment);
router.delete("/:commentId", verifyToken, deleteComment);

export default router;
