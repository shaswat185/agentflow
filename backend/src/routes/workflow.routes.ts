import { Router } from "express";
import { createWorkflow, getWorkflows, getWorkflowById, updateWorkflow,deleteWorkflow } from "../controllers/workflow.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import { body } from "express-validator";
import validationMiddleware from "../middleware/validation.middleware.js";


const router = Router();

router.post(
  "/",
  authMiddleware,
  [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Workflow name is required"),
  ],
  validationMiddleware,
  createWorkflow
);
router.get("/", authMiddleware, getWorkflows);
router.get("/:id", authMiddleware, getWorkflowById);

router.put(
  "/:id",
  authMiddleware,
  [
    body("name")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Workflow name cannot be empty"),

    body("status")
      .optional()
      .isIn(["draft", "active"])
      .withMessage("Invalid workflow status"),
  ],
  validationMiddleware,
  updateWorkflow
);

router.delete("/:id", authMiddleware, deleteWorkflow);

export default router;