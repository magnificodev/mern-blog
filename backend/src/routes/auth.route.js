import express from "express";

import { signUp, signIn, googleAuth, signOut } from "../controllers/auth.controller.js";
import {
    signUpValidator,
    signInValidator,
} from "../validators/auth.validator.js";
import verifyToken from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/signup", signUpValidator, signUp);
router.post("/signin", signInValidator, signIn);
router.post("/google", googleAuth);
router.post("/signout", signOut);

export default router;
