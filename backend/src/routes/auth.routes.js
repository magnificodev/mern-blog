import express from "express";

import {
    signUp,
    signIn,
    googleAuth,
    signOut,
    refreshToken,
    checkAuth,
} from "../controllers/auth.controller.js";
import {
    signUpValidator,
    signInValidator,
} from "../validators/auth.validator.js";

const router = express.Router();

router.post("/signup", signUpValidator, signUp);
router.post("/signin", signInValidator, signIn);
router.post("/google", googleAuth);
router.post("/signout", signOut);
router.post("/refresh", refreshToken);
router.get("/check-auth", checkAuth);

export default router;
