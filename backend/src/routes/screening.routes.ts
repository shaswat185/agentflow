import { Router } from "express";
import { screenResume } from "../controllers/screening.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", authMiddleware, screenResume);

export default router;