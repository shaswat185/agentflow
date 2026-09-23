import { GoogleGenerativeAI } from "@google/generative-ai";

export const matchCandidateToJob = async (
  resumeText: string,
  jobTitle: string,
  jobDescription: string,
  jobSkills: string[]
) => {
  if (!resumeText.trim()) {
    throw new Error("Resume text is required");
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing in .env file");
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: "gemini-3.6-flash",
  });

  const prompt = `
You are an AI recruitment matching assistant.

Compare the candidate resume with the job requirements.

Return only valid JSON in this format:

{
  "matchScore": number,
  "recommendation": "strong_match" | "possible_match" | "poor_match",
  "matchedSkills": ["skill1", "skill2"],
  "missingSkills": ["skill1", "skill2"],
  "reason": "short explanation"
}

Job Title:
${jobTitle}

Job Description:
${jobDescription}

Required Skills:
${jobSkills.join(", ")}

Candidate Resume:
${resumeText}
`;

  const result = await model.generateContent(prompt);

  const responseText = result.response.text();

  const cleanedResponse = responseText
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  return JSON.parse(cleanedResponse);
};