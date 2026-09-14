export const screenCandidate = async (resumeText: string) => {
  if (!resumeText.trim()) {
    throw new Error("Resume text is required");
  }

  return {
    score: 0,
    status: "pending",
    feedback: "AI screening service is not connected yet",
  };
};