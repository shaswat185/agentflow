import { Router } from "express";
import { body } from "express-validator";

import authMiddleware from "../middleware/auth.middleware.js";
import validationMiddleware from "../middleware/validation.middleware.js";

import {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
} from "../controllers/job.controller.js";

const router = Router();

router.post(
  "/",
  authMiddleware,
  [
    body("title")
      .trim()
      .notEmpty()
      .withMessage("Job title is required"),

    body("description")
      .trim()
      .notEmpty()
      .withMessage("Job description is required"),

    body("status")
      .optional()
      .isIn(["open", "closed"])
      .withMessage("Invalid job status"),
  ],
  validationMiddleware,
  createJob
);

router.get(
  "/",
  authMiddleware,
  getJobs
);

router.get(
  "/:id",
  authMiddleware,
  getJobById
);

router.put(
  "/:id",
  authMiddleware,
  [
    body("title")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Job title cannot be empty"),

    body("description")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Job description cannot be empty"),

    body("status")
      .optional()
      .isIn(["open", "closed"])
      .withMessage("Invalid job status"),
  ],
  validationMiddleware,
  updateJob
);

router.delete(
  "/:id",
  authMiddleware,
  deleteJob
);

export default router;