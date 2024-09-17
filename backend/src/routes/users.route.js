import express from "express";

import { updateUser, deleteUser, getUsers } from "../controllers/users.controller.js";
import verifyToken from "../middlewares/auth.middleware.js";
import { updateValidator } from "../validators/user.validator.js";

const router = express.Router();

router.get("/", verifyToken, getUsers);
router.put("/:userId", verifyToken, updateValidator, updateUser);
router.delete("/:userId", verifyToken, deleteUser);

export default router;
