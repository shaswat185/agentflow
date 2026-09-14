import { Request, Response } from "express";
import Workflow from "../models/workflow.model.js";

export const createWorkflow = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, description, nodes, edges, status } = req.body;

    if (!name) {
      res.status(400).json({
        success: false,
        message: "Workflow name is required",
      });
      return;
    }

    const workflow = await Workflow.create({
      name,
      description,
      nodes: nodes || [],
      edges: edges || [],
      status: status || "draft",
    });

    res.status(201).json({
      success: true,
      message: "Workflow created successfully",
      data: workflow,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create workflow",
    });
  }
};





export const getWorkflows = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const workflows = await Workflow.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: workflows,
    });
  } catch (error) {
    console.error("Get workflows error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch workflows",
    });
  }
};




export const getWorkflowById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const workflow = await Workflow.findById(id);

    if (!workflow) {
      res.status(404).json({
        success: false,
        message: "Workflow not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: workflow,
    });
  } catch (error) {
    console.error("Get workflow error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch workflow",
    });
  }
};



export const updateWorkflow = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description, nodes, edges, status } = req.body;

    const workflow = await Workflow.findByIdAndUpdate(
      id,
      {
        name,
        description,
        nodes,
        edges,
        status,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!workflow) {
      res.status(404).json({
        success: false,
        message: "Workflow not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Workflow updated successfully",
      data: workflow,
    });
  } catch (error) {
    console.error("Update workflow error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update workflow",
    });
  }
};



export const deleteWorkflow = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const workflow = await Workflow.findByIdAndDelete(id);

    if (!workflow) {
      res.status(404).json({
        success: false,
        message: "Workflow not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Workflow deleted successfully",
    });
  } catch (error) {
    console.error("Delete workflow error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete workflow",
    });
  }
};