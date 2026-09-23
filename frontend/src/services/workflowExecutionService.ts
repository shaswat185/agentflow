const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

const getAuthToken = (): string | null => {
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("authToken")
  );
};

const getHeaders = (): HeadersInit => {
  const token = getAuthToken();

  return {
    "Content-Type": "application/json",
    ...(token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {}),
  };
};

export interface WorkflowExecutionPayload {
  workflowId: string;
  candidateId: string;
  jobId: string;
  resumeText: string;
}

export interface ExecutionStep {
  nodeId: string;
  nodeType: string;
  status: "completed" | "skipped" | "failed";
  message: string;
  data?: unknown;
}

export interface WorkflowExecutionResult {
  success: boolean;
  workflowId: string;
  candidateId: string;
  jobId: string;
  matchScore: number;
  finalStatus: "shortlisted" | "rejected";
  matchingResult?: unknown;
  steps: ExecutionStep[];
  executionLogId: string;
}

export const runWorkflow = async (
  payload: WorkflowExecutionPayload
): Promise<WorkflowExecutionResult> => {
  const response = await fetch(
    `${API_URL}/workflow-execution`,
    {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Workflow execution failed"
    );
  }

  return data.data;
};