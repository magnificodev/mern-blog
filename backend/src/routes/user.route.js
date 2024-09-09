import express from "express";

import { updateUser } from "../controllers/user.controller.js";
import verifyToken from "../middlewares/auth.middleware.js";
import { updateValidator } from "../validators/user.validator.js";

const router = express.Router();

router.put("/:userId", verifyToken, updateValidator, updateUser);

export default router;
