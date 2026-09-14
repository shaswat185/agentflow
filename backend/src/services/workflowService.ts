import axios from "axios";

const API_URL = "http://localhost:5000/api/workflows";

export const createWorkflow = async (workflowData: {
  name: string;
  description?: string;
  nodes: unknown[];
  edges: unknown[];
  status?: "draft" | "active";
}) => {
  const response = await axios.post(API_URL, workflowData);

  return response.data;
};