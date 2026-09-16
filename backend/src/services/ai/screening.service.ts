import { GoogleGenerativeAI } from "@google/generative-ai";

export const screenCandidate = async (resumeText: string) => {
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
You are an AI recruitment screening assistant.

Analyze the following resume and return only valid JSON in this format:

{
  "score": number,
  "status": "shortlisted" | "pending" | "rejected",
  "feedback": "short explanation"
}

Resume:
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