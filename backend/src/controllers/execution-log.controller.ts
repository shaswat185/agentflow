import { Request, Response } from "express";
import ExecutionLog from "../models/execution-log.model.js";

export const getExecutionLogs = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const logs = await ExecutionLog.find()
      .populate(
        "candidateId",
        "name email status screeningScore feedback"
      )
      .populate(
        "jobId",
        "title description skills"
      )
      .populate(
        "workflowId",
        "name description status"
      )
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      data: logs,
    });
  } catch (error) {
    console.error(
      "Get execution logs error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch execution logs",
    });
  }
};