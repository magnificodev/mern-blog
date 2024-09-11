import express from "express";

import { UpdateUser, DeleteUser } from "../controllers/user.controller.js";
import verifyToken from "../middlewares/auth.middleware.js";
import { updateValidator } from "../validators/user.validator.js";

const router = express.Router();

router.put("/:userId", verifyToken, updateValidator, UpdateUser);
router.delete("/:userId", verifyToken, DeleteUser);

export default router;
