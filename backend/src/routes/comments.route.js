import express from "express";
import verifyToken from "../middlewares/auth.middleware.js";
import {
    createComment,
    getPostComments,
    likeComment,
    deleteComment,
    editComment,
    updateComment,
} from "../controllers/comments.controller.js";

const router = express.Router();

router.get("/:postId", getPostComments);
router.post("/", verifyToken, createComment);
router.patch("/:commentId/likes", verifyToken, likeComment);
router.patch("/:commentId", verifyToken, editComment);
router.delete("/:commentId", verifyToken, deleteComment);

export default router;
