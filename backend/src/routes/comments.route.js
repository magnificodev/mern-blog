import express from "express";
import verifyToken from "../middlewares/auth.middleware.js";
import { createComment } from "../controllers/comments.controller.js";

const router = express.Router();

router.post("/", verifyToken, createComment);

export default router;
