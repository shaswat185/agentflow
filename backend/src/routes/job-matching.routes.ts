import { Router } from "express";
import { matchCandidate } from "../controllers/job-matching.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", authMiddleware, matchCandidate);

export default router;