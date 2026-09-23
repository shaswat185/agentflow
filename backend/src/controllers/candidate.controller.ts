import { Request, Response } from "express";
import mongoose from "mongoose";
import Candidate from "../models/candidate.model.js";

export const createCandidate = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      name,
      email,
      phone,
      jobId,
      resumeUrl,
      experience,
      skills,
      screeningScore,
      status,
    } = req.body;

    if (!name || !email) {
      res.status(400).json({
        success: false,
        message: "Name and email are required",
      });
      return;
    }

    if (
      jobId &&
      !mongoose.Types.ObjectId.isValid(jobId)
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid job ID",
      });
      return;
    }

    const candidate = await Candidate.create({
      name,
      email,
      phone,
      jobId: jobId || undefined,
      resumeUrl,
      experience,
      skills: skills || [],
      screeningScore,
      status: status || "new",
    });

    const populatedCandidate =
      await Candidate.findById(candidate._id).populate(
        "jobId",
        "title"
      );

    res.status(201).json({
      success: true,
      message: "Candidate created successfully",
      data: populatedCandidate,
    });
  } catch (error: any) {
    console.error("Create candidate error:", error);

    if (error.code === 11000) {
      res.status(409).json({
        success: false,
        message: "Candidate email already exists",
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Failed to create candidate",
    });
  }
};

export const getCandidates = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const candidates = await Candidate.find()
      .populate("jobId", "title")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: candidates,
    });
  } catch (error) {
    console.error("Get candidates error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch candidates",
    });
  }
};

export const getCandidateById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = String(req.params.id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid candidate ID",
      });
      return;
    }

    const candidate = await Candidate.findById(id).populate(
      "jobId",
      "title"
    );

    if (!candidate) {
      res.status(404).json({
        success: false,
        message: "Candidate not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: candidate,
    });
  } catch (error) {
    console.error("Get candidate error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch candidate",
    });
  }
};

export const updateCandidate = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = String(req.params.id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid candidate ID",
      });
      return;
    }

    const {
      name,
      email,
      phone,
      jobId,
      resumeUrl,
      experience,
      skills,
      feedback,
      screeningScore,
      status,
    } = req.body;

    if (
      jobId &&
      !mongoose.Types.ObjectId.isValid(jobId)
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid job ID",
      });
      return;
    }

    const candidate =
      await Candidate.findByIdAndUpdate(
        id,
        {
          name,
          email,
          phone,
          jobId: jobId || undefined,
          resumeUrl,
          experience,
          skills,
          feedback,
          screeningScore,
          status,
        },
        {
          new: true,
          runValidators: true,
        }
      ).populate("jobId", "title");

    if (!candidate) {
      res.status(404).json({
        success: false,
        message: "Candidate not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Candidate updated successfully",
      data: candidate,
    });
  } catch (error: any) {
    console.error("Update candidate error:", error);

    if (error.code === 11000) {
      res.status(409).json({
        success: false,
        message: "Candidate email already exists",
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Failed to update candidate",
    });
  }
};

export const deleteCandidate = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = String(req.params.id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid candidate ID",
      });
      return;
    }

    const candidate =
      await Candidate.findByIdAndDelete(id);

    if (!candidate) {
      res.status(404).json({
        success: false,
        message: "Candidate not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Candidate deleted successfully",
    });
  } catch (error) {
    console.error("Delete candidate error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete candidate",
    });
  }
};