import { Request, Response } from "express";
import mongoose from "mongoose";
import Workflow from "../models/workflow.model.js";
import Candidate from "../models/candidate.model.js";
import Job from "../models/job.model.js";
import { executeWorkflow } from "../services/workflow-execution.service.js";

export const runWorkflow = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      workflowId,
      candidateId,
      jobId,
      resumeText,
    } = req.body;

    if (
      !workflowId ||
      !candidateId ||
      !jobId ||
      !resumeText
    ) {
      res.status(400).json({
        success: false,
        message:
          "workflowId, candidateId, jobId and resumeText are required",
      });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(workflowId)) {
      res.status(400).json({
        success: false,
        message: "Invalid workflow ID",
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

    const workflow = await Workflow.findById(workflowId);
    const candidate = await Candidate.findById(candidateId);
    const job = await Job.findById(jobId);

    if (!workflow) {
      res.status(404).json({
        success: false,
        message: "Workflow not found",
      });
      return;
    }

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

    if (!workflow.nodes?.length) {
      res.status(400).json({
        success: false,
        message: "Workflow has no nodes",
      });
      return;
    }

    const result = await executeWorkflow(
      workflowId,
      candidateId,
      jobId,
      resumeText,
      job.title,
      job.description,
      job.skills,
      workflow.nodes as any[],
      workflow.edges as any[]
    );

    res.status(200).json({
      success: true,
      message: "Workflow executed successfully",
      data: result,
    });
  } catch (error) {
    console.error(
      "Workflow execution error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to execute workflow",
    });
  }
};