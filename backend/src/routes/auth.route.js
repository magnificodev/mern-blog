import express from "express";

import { SignUp, SignIn, GoogleAuth, SignOut } from "../controllers/auth.controller.js";
import {
    signUpValidator,
    signInValidator,
} from "../validators/auth.validator.js";
import verifyToken from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/signup", signUpValidator, SignUp);
router.post("/signin", signInValidator, SignIn);
router.post("/google", GoogleAuth);
router.post("/signout", verifyToken, SignOut);

export default router;
