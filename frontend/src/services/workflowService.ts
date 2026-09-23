const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

const getAuthToken = (): string | null => {
  return localStorage.getItem("token");
};

const getHeaders = (): HeadersInit => {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Access token is required");
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export interface WorkflowPayload {
  name: string;
  description?: string;
  nodes: unknown[];
  edges: unknown[];
  status?: "draft" | "active";
}

export interface WorkflowResponse {
  _id: string;
  name: string;
  description?: string;
  nodes: unknown[];
  edges: unknown[];
  status: "draft" | "active";
  createdAt?: string;
  updatedAt?: string;
}

/* CREATE */

export const createWorkflow = async (
  workflow: WorkflowPayload
): Promise<WorkflowResponse> => {
  const response = await fetch(
    `${API_URL}/workflows`,
    {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(workflow),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed to create workflow"
    );
  }

  return data.data;
};

/* GET ALL */

export const getWorkflows = async (): Promise<
  WorkflowResponse[]
> => {
  const response = await fetch(
    `${API_URL}/workflows`,
    {
      method: "GET",
      headers: getHeaders(),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed to fetch workflows"
    );
  }

  return data.data || [];
};

/* GET ONE */

export const getWorkflowById = async (
  id: string
): Promise<WorkflowResponse> => {
  const response = await fetch(
    `${API_URL}/workflows/${id}`,
    {
      method: "GET",
      headers: getHeaders(),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed to fetch workflow"
    );
  }

  return data.data;
};

/* UPDATE */

export const updateWorkflow = async (
  id: string,
  workflow: WorkflowPayload
): Promise<WorkflowResponse> => {
  const response = await fetch(
    `${API_URL}/workflows/${id}`,
    {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(workflow),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed to update workflow"
    );
  }

  return data.data;
};

/* DELETE */

export const deleteWorkflow = async (
  id: string
): Promise<void> => {
  const response = await fetch(
    `${API_URL}/workflows/${id}`,
    {
      method: "DELETE",
      headers: getHeaders(),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed to delete workflow"
    );
  }
};