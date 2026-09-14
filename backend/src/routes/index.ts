import { Router } from "express";
import healthRoutes from "./health.routes.js";
import workflowRoutes from "./workflow.routes.js";
import authRoutes from "./auth.routes.js";
import candidateRoutes from "./candidate.routes.js";
import screeningRoutes from "./screening.routes.js";


const router = Router();

router.use("/health", healthRoutes);
router.use("/workflows", workflowRoutes);
router.use("/auth", authRoutes);
router.use("/candidates", candidateRoutes);
router.use("/screening", screeningRoutes);



export default router;