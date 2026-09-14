import { Request, Response } from "express";
import { screenCandidate } from "../services/ai/screening.service.js";

export const screenResume = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { resumeText } = req.body;

    if (!resumeText) {
      res.status(400).json({
        success: false,
        message: "Resume text is required",
      });
      return;
    }

    const result = await screenCandidate(resumeText);

    res.status(200).json({
      success: true,
      message: "Resume screening completed",
      data: result,
    });
  } catch (error) {
    console.error("Screening error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to screen resume",
    });
  }
};