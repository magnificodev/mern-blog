import express from "express";
import verifyToken from "../middlewares/auth.middleware.js";
import { createValidator, updateValidator } from "../validators/post.validator.js";
import { createPost, deletePost, getPost, getPosts, updatePost } from "../controllers/posts.controller.js";

const router = express.Router();

router.get("/", getPosts);
router.get("/:postId", getPost)
router.post("/", verifyToken, createValidator, createPost);
router.put("/:postId", verifyToken, updateValidator, updatePost);
router.delete("/:postId", verifyToken, deletePost);

export default router;
