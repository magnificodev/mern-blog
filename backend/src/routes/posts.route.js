import express from "express";
import verifyToken from "../middlewares/auth.middleware.js";
import { createPost, getPosts, deletePost, updatePost } from "../controllers/posts.controller.js";
import { createValidator } from "../validators/post.validator.js";

const router = express.Router();

router.post("/", verifyToken, createValidator, createPost);
router.get("/", getPosts);
router.put("/:postId", verifyToken, updatePost);
router.delete("/:postId", verifyToken, deletePost);
export default router;
