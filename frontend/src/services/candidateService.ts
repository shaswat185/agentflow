const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

const getHeaders = (): HeadersInit => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Access token is required");
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export type CandidateStatus =
  | "new"
  | "screening"
  | "pending"
  | "shortlisted"
  | "interview"
  | "rejected";

export interface Candidate {
  _id: string;
  name: string;
  email: string;
  phone?: string;

  jobId?: {
    _id: string;
    title: string;
  } | null;

  resumeUrl?: string;
  experience?: string;
  skills?: string[];
  feedback?: string;

  screeningScore?: number;

  status: CandidateStatus;

  createdAt?: string;
  updatedAt?: string;
}

export interface CandidatePayload {
  name: string;
  email: string;
  phone?: string;
  jobId?: string;
  resumeUrl?: string;
  experience?: string;
  skills?: string[];
  feedback?: string;
  screeningScore?: number;
  status?: CandidateStatus;
}

export const getCandidates =
  async (): Promise<Candidate[]> => {
    const response = await fetch(
      `${API_URL}/candidates`,
      {
        method: "GET",
        headers: getHeaders(),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Failed to fetch candidates"
      );
    }

    return data.data || [];
  };

export const createCandidate = async (
  candidate: CandidatePayload
): Promise<Candidate> => {
  const response = await fetch(
    `${API_URL}/candidates`,
    {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(candidate),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed to create candidate"
    );
  }

  return data.data;
};

export const updateCandidate = async (
  id: string,
  candidate: CandidatePayload
): Promise<Candidate> => {
  const response = await fetch(
    `${API_URL}/candidates/${id}`,
    {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(candidate),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed to update candidate"
    );
  }

  return data.data;
};

export const deleteCandidate = async (
  id: string
): Promise<void> => {
  const response = await fetch(
    `${API_URL}/candidates/${id}`,
    {
      method: "DELETE",
      headers: getHeaders(),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed to delete candidate"
    );
  }
};