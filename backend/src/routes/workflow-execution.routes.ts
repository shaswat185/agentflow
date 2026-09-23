import { Router } from "express";
import { runWorkflow } from "../controllers/workflow-execution.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", authMiddleware, runWorkflow);

export default router;