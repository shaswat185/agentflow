import mongoose, { Document, Schema } from "mongoose";

export interface ICandidate extends Document {
  name: string;
  email: string;
  resumeUrl?: string;
  screeningScore?: number;
  status: "pending" | "shortlisted" | "rejected";
}

const candidateSchema = new Schema<ICandidate>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    resumeUrl: {
      type: String,
      trim: true,
    },
    screeningScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    status: {
      type: String,
      enum: ["pending", "shortlisted", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const Candidate = mongoose.model<ICandidate>(
  "Candidate",
  candidateSchema
);

export default Candidate;