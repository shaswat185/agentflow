import { Request, Response } from "express";
import Candidate from "../models/candidate.model.js";
import mongoose from "mongoose";

export const createCandidate = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { name, email, resumeUrl } = req.body;

        if (!name || !email) {
            res.status(400).json({
                success: false,
                message: "Name and email are required",
            });
            return;
        }

        const candidate = await Candidate.create({
            name,
            email,
            resumeUrl,
        });

        res.status(201).json({
            success: true,
            message: "Candidate created successfully",
            data: candidate,
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
        const candidates = await Candidate.find().sort({ createdAt: -1 });

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
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({
                success: false,
                message: "Invalid candidate ID",
            });
            return;
        }

        const candidate = await Candidate.findById(id);

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
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({
                success: false,
                message: "Invalid candidate ID",
            });
            return;
        }

        const { name, email, resumeUrl, screeningScore, status } = req.body;

        const candidate = await Candidate.findByIdAndUpdate(
            id,
            {
                name,
                email,
                resumeUrl,
                screeningScore,
                status,
            },
            {
                new: true,
                runValidators: true,
            }
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
            message: "Candidate updated successfully",
            data: candidate,
        });
    } catch (error) {
        console.error("Update candidate error:", error);

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
        const { id } = req.params;


        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({
                success: false,
                message: "Invalid candidate ID",
            });
            return;
        }

        const candidate = await Candidate.findByIdAndDelete(id);

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