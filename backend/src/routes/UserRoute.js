import express from "express";

import { testApi } from "../controllers/UserController.js";

const router = express.Router();

router.get("/test", testApi);

export default router;
