import { Router } from "express";
import { getExecutionLogs } from "../controllers/execution-log.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", authMiddleware, getExecutionLogs);

export default router;