const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Access token is required");
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export interface Job {
  _id: string;
  title: string;
  department?: string;
  location?: string;
  employmentType?:
    | "Full-time"
    | "Part-time"
    | "Contract"
    | "Internship";
  description: string;
  skills?: string[];
  experience?: string;
  status: "open" | "closed";
  createdAt?: string;
  updatedAt?: string;
}

export interface JobPayload {
  title: string;
  department?: string;
  location?: string;
  employmentType?:
    | "Full-time"
    | "Part-time"
    | "Contract"
    | "Internship";
  description: string;
  skills?: string[];
  experience?: string;
  status?: "open" | "closed";
}

export const getJobs = async (): Promise<Job[]> => {
  const response = await fetch(`${API_URL}/jobs`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch jobs"
    );
  }

  return data.data || [];
};

export const createJob = async (
  job: JobPayload
): Promise<Job> => {
  const response = await fetch(`${API_URL}/jobs`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(job),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to create job"
    );
  }

  return data.data;
};

export const updateJob = async (
  id: string,
  job: JobPayload
): Promise<Job> => {
  const response = await fetch(`${API_URL}/jobs/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(job),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to update job"
    );
  }

  return data.data;
};

export const deleteJob = async (
  id: string
): Promise<void> => {
  const response = await fetch(`${API_URL}/jobs/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to delete job"
    );
  }
};