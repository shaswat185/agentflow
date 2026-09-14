import mongoose, { Schema, Document } from "mongoose";

export interface IWorkflow extends Document {
  name: string;
  description?: string;
  nodes: unknown[];
  edges: unknown[];
  status: "draft" | "active";
}

const workflowSchema = new Schema<IWorkflow>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    nodes: {
      type: [Schema.Types.Mixed],
      default: [],
    },
    edges: {
      type: [Schema.Types.Mixed],
      default: [],
    },
    status: {
      type: String,
      enum: ["draft", "active"],
      default: "draft",
    },
  },
  {
    timestamps: true,
  }
);

const Workflow = mongoose.model<IWorkflow>(
  "Workflow",
  workflowSchema
);

export default Workflow;