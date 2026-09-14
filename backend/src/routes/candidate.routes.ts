import { Router } from "express";
import {
  createCandidate,
  getCandidates,
  getCandidateById,
  updateCandidate,
  deleteCandidate
} from "../controllers/candidate.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", authMiddleware, createCandidate);
router.get("/", authMiddleware, getCandidates);
router.get("/:id", authMiddleware, getCandidateById);
router.put("/:id", authMiddleware, updateCandidate);
router.delete("/:id", authMiddleware, deleteCandidate);

export default router;