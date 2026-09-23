import mongoose, { Document, Schema } from "mongoose";

interface IExecutionStep {
  nodeId: string;
  nodeType: string;
  status: "completed" | "skipped" | "failed";
  message: string;
  data?: unknown;
}

export interface IExecutionLog extends Document {
  workflowId: mongoose.Types.ObjectId;
  candidateId: mongoose.Types.ObjectId;
  jobId: mongoose.Types.ObjectId;
  matchScore: number;
  finalStatus: "shortlisted" | "rejected";
  message: string;
  steps: IExecutionStep[];
}

const executionStepSchema = new Schema<IExecutionStep>(
  {
    nodeId: {
      type: String,
      required: true,
    },

    nodeType: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["completed", "skipped", "failed"],
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    data: {
      type: Schema.Types.Mixed,
    },
  },
  {
    _id: false,
  }
);

const executionLogSchema = new Schema<IExecutionLog>(
  {
    workflowId: {
      type: Schema.Types.ObjectId,
      ref: "Workflow",
      required: true,
    },

    candidateId: {
      type: Schema.Types.ObjectId,
      ref: "Candidate",
      required: true,
    },

    jobId: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    matchScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    finalStatus: {
      type: String,
      enum: ["shortlisted", "rejected"],
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    steps: {
      type: [executionStepSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const ExecutionLog = mongoose.model<IExecutionLog>(
  "ExecutionLog",
  executionLogSchema
);

export default ExecutionLog;