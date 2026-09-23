import { Request, Response } from "express";
import mongoose from "mongoose";
import Candidate from "../models/candidate.model.js";
import Job from "../models/job.model.js";
import { matchCandidateToJob } from "../services/ai/job-matching.service.js";

export const matchCandidate = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { candidateId, jobId, resumeText } = req.body;

    if (!candidateId || !jobId || !resumeText) {
      res.status(400).json({
        success: false,
        message: "candidateId, jobId and resumeText are required",
      });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(candidateId)) {
      res.status(400).json({
        success: false,
        message: "Invalid candidate ID",
      });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      res.status(400).json({
        success: false,
        message: "Invalid job ID",
      });
      return;
    }

    const candidate = await Candidate.findById(candidateId);
    const job = await Job.findById(jobId);

    if (!candidate) {
      res.status(404).json({
        success: false,
        message: "Candidate not found",
      });
      return;
    }

    if (!job) {
      res.status(404).json({
        success: false,
        message: "Job not found",
      });
      return;
    }

    const result = await matchCandidateToJob(
      resumeText,
      job.title,
      job.description,
      job.skills
    );

    res.status(200).json({
      success: true,
      message: "Candidate-job matching completed",
      data: {
        candidate,
        job,
        result,
      },
    });
  } catch (error) {
    console.error("Job matching error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to match candidate with job",
    });
  }
};