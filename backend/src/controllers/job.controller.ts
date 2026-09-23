import { Request, Response } from "express";
import Job from "../models/job.model.js";

export const createJob = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      title,
      department,
      location,
      employmentType,
      description,
      skills,
      experience,
      status,
    } = req.body;

    if (!title || !description) {
      res.status(400).json({
        success: false,
        message: "Job title and description are required",
      });
      return;
    }

    const job = await Job.create({
      title,
      department,
      location,
      employmentType,
      description,
      skills: skills || [],
      experience,
      status: status || "open",
    });

    res.status(201).json({
      success: true,
      message: "Job created successfully",
      data: job,
    });
  } catch (error) {
    console.error("Create job error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create job",
    });
  }
};

export const getJobs = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: jobs,
    });
  } catch (error) {
    console.error("Get jobs error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch jobs",
    });
  }
};

export const getJobById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const job = await Job.findById(id);

    if (!job) {
      res.status(404).json({
        success: false,
        message: "Job not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error) {
    console.error("Get job by ID error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch job",
    });
  }
};

export const updateJob = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const {
      title,
      department,
      location,
      employmentType,
      description,
      skills,
      experience,
      status,
    } = req.body;

    const job = await Job.findByIdAndUpdate(
      id,
      {
        title,
        department,
        location,
        employmentType,
        description,
        skills,
        experience,
        status,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!job) {
      res.status(404).json({
        success: false,
        message: "Job not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Job updated successfully",
      data: job,
    });
  } catch (error) {
    console.error("Update job error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update job",
    });
  }
};

export const deleteJob = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const job = await Job.findByIdAndDelete(id);

    if (!job) {
      res.status(404).json({
        success: false,
        message: "Job not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    console.error("Delete job error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete job",
    });
  }
};