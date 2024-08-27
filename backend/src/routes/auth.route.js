import express from "express";

import { SignUp, SignIn, GoogleAuth } from "../controllers/auth.controller.js";
import {
    signUpValidator,
    signInValidator,
} from "../validators/auth.validator.js";

const router = express.Router();

router.post("/signup", signUpValidator, SignUp);
router.post("/signin", signInValidator, SignIn);
router.post("/google", GoogleAuth);

export default router;
