import { Request, Response } from "express";
import { screenCandidate } from "../services/ai/screening.service.js";
import Candidate from "../models/candidate.model.js";
import mongoose from "mongoose";

export const screenResume = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { resumeText, candidateId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(candidateId)) {
  res.status(400).json({
    success: false,
    message: "Invalid candidate ID",
  });
  return;
}

    if (!resumeText || !candidateId) {
      res.status(400).json({
        success: false,
        message: "resumeText and candidateId are required",
      });
      return;
    }

    const result = await screenCandidate(resumeText);

    const updatedCandidate = await Candidate.findByIdAndUpdate(
      candidateId,
      {
        screeningScore: result.score,
        status: result.status,
        feedback: result.feedback,
      },
      { new: true }
    );

    if (!updatedCandidate) {
      res.status(404).json({
        success: false,
        message: "Candidate not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Resume screening completed",
      data: {
        result,
        candidate: updatedCandidate,
      },
    });
  } catch (error) {
    console.error("Screening error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to screen resume",
    });
  }
};