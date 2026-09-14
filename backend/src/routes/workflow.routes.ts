import { Router } from "express";
import { createWorkflow, getWorkflows, getWorkflowById, updateWorkflow,deleteWorkflow } from "../controllers/workflow.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";


const router = Router();

router.post("/", authMiddleware, createWorkflow);
router.get("/", authMiddleware, getWorkflows);
router.get("/:id", authMiddleware, getWorkflowById);
router.put("/:id", authMiddleware, updateWorkflow);
router.delete("/:id", authMiddleware, deleteWorkflow);

export default router;