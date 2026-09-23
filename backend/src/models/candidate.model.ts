import mongoose, { Document, Schema } from "mongoose";

export interface ICandidate extends Document {
  name: string;
  email: string;
  phone?: string;
  jobId?: mongoose.Types.ObjectId;
  resumeUrl?: string;
  experience?: string;
  skills?: string[];
  feedback?: string;
  screeningScore?: number;
  status:
    | "new"
    | "screening"
    | "pending"
    | "shortlisted"
    | "interview"
    | "rejected";
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
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    jobId: {
      type: Schema.Types.ObjectId,
      ref: "Job",
    },

    resumeUrl: {
      type: String,
      trim: true,
    },

    experience: {
      type: String,
      trim: true,
    },

    skills: {
      type: [String],
      default: [],
    },

    feedback: {
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
      enum: [
        "new",
        "screening",
        "pending",
        "shortlisted",
        "interview",
        "rejected",
      ],
      default: "new",
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