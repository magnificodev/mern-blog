import express from "express";

import { updateUser, deleteUser, getUsers, getUser } from "../controllers/users.controller.js";
import verifyToken from "../middlewares/auth.middleware.js";
import { updateValidator } from "../validators/user.validator.js";

const router = express.Router();

router.get("/", verifyToken, getUsers);
router.get("/:userId", getUser);
router.patch("/:userId", verifyToken, updateValidator, updateUser);
router.delete("/:userId", verifyToken, deleteUser);

export default router;
