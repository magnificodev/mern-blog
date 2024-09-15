import express from "express";
import verifyToken from "../middlewares/auth.middleware.js";
import { createPost } from "../controllers/posts.controller.js";
import { createValidator } from "../validators/post.validator.js";

const router = express.Router();

router.post("/", verifyToken, createValidator, createPost);

export default router;
