import mongoose, { Document, Schema } from "mongoose";

export interface IJob extends Document {
  title: string;
  department?: string;
  location?: string;
  employmentType?: "Full-time" | "Part-time" | "Contract" | "Internship";
  description: string;
  skills: string[];
  experience?: string;
  status: "open" | "closed";
}

const jobSchema = new Schema<IJob>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    department: {
      type: String,
      trim: true,
    },

    location: {
      type: String,
      trim: true,
    },

    employmentType: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract", "Internship"],
      default: "Full-time",
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    skills: {
      type: [String],
      default: [],
    },

    experience: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open",
    },
  },
  {
    timestamps: true,
  }
);

const Job = mongoose.model<IJob>("Job", jobSchema);

export default Job;