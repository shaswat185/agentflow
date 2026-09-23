import { Router } from "express";
import { body } from "express-validator";

import {
  createCandidate,
  getCandidates,
  getCandidateById,
  updateCandidate,
  deleteCandidate,
} from "../controllers/candidate.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import validationMiddleware from "../middleware/validation.middleware.js";

const router = Router();

router.post(
  "/",
  authMiddleware,
  [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Candidate name is required"),

    body("email")
      .isEmail()
      .withMessage("Valid candidate email is required")
      .normalizeEmail(),

    body("screeningScore")
      .optional()
      .isFloat({ min: 0, max: 100 })
      .withMessage(
        "Screening score must be between 0 and 100"
      ),

    body("status")
      .optional()
      .isIn([
        "new",
        "screening",
        "pending",
        "shortlisted",
        "interview",
        "rejected",
      ])
      .withMessage("Invalid candidate status"),
  ],
  validationMiddleware,
  createCandidate
);

router.get(
  "/",
  authMiddleware,
  getCandidates
);

router.get(
  "/:id",
  authMiddleware,
  getCandidateById
);

router.put(
  "/:id",
  authMiddleware,
  [
    body("name")
      .optional()
      .trim()
      .notEmpty()
      .withMessage(
        "Candidate name cannot be empty"
      ),

    body("email")
      .optional()
      .isEmail()
      .withMessage(
        "Valid candidate email is required"
      )
      .normalizeEmail(),

    body("screeningScore")
      .optional()
      .isFloat({ min: 0, max: 100 })
      .withMessage(
        "Screening score must be between 0 and 100"
      ),

    body("status")
      .optional()
      .isIn([
        "new",
        "screening",
        "pending",
        "shortlisted",
        "interview",
        "rejected",
      ])
      .withMessage("Invalid candidate status"),
  ],
  validationMiddleware,
  updateCandidate
);

router.delete(
  "/:id",
  authMiddleware,
  deleteCandidate
);

export default router;