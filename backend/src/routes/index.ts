import { Router } from "express";
import jobRoutes from "./job.routes.js";
import healthRoutes from "./health.routes.js";
import workflowRoutes from "./workflow.routes.js";
import authRoutes from "./auth.routes.js";
import candidateRoutes from "./candidate.routes.js";
import screeningRoutes from "./screening.routes.js";
import jobMatchingRoutes from "./job-matching.routes.js";
import workflowExecutionRoutes from "./workflow-execution.routes.js";
import executionLogRoutes from "./execution-log.routes.js";


const router = Router();

router.use("/health", healthRoutes);
router.use("/workflows", workflowRoutes);
router.use("/auth", authRoutes);
router.use("/candidates", candidateRoutes);
router.use("/screening", screeningRoutes);
router.use("/jobs", jobRoutes);
router.use("/job-matching", jobMatchingRoutes);
router.use("/workflow-execution", workflowExecutionRoutes);
router.use("/execution-logs", executionLogRoutes);



export default router;