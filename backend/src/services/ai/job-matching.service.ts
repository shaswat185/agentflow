
import { GoogleGenerativeAI } from "@google/generative-ai";

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

const isRetryableError = (error: unknown): boolean => {
  const err = error as {
    status?: number;
    message?: string;
  };

  const status = err?.status;
  const message = err?.message ?? String(error);

  return (
    [429, 500, 502, 503, 504].includes(Number(status)) ||
    /\b(429|500|502|503|504)\b/.test(message) ||
    /high demand|temporarily unavailable|overloaded/i.test(message)
  );
};

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
    model: "gemini-3.8-flash",
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.2,
    },
  });

  const prompt = `
You are an AI recruitment matching assistant.

Compare the candidate resume with the job requirements.

Return a JSON object with exactly these fields:
{
  "matchScore": 0,
  "recommendation": "possible_match",
  "matchedSkills": [],
  "missingSkills": [],
  "reason": "Short explanation"
}

Rules:
- matchScore must be a number from 0 to 100.
- recommendation must be "strong_match", "possible_match", or "poor_match".
- matchedSkills and missingSkills must be arrays of strings.
- reason must be a short string.
- Evaluate only the information provided.
- Do not invent candidate qualifications.

Job Title:
${jobTitle}

Job Description:
${jobDescription}

Required Skills:
${jobSkills.join(", ")}

Candidate Resume:
${resumeText}
`;

  const maxAttempts = 3;
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      const cleanedResponse = responseText
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

      const parsed = JSON.parse(cleanedResponse);

      if (
        typeof parsed.matchScore !== "number" ||
        parsed.matchScore < 0 ||
        parsed.matchScore > 100 ||
        !["strong_match", "possible_match", "poor_match"].includes(
          parsed.recommendation
        ) ||
        !Array.isArray(parsed.matchedSkills) ||
        !Array.isArray(parsed.missingSkills) ||
        typeof parsed.reason !== "string"
      ) {
        throw new Error("Gemini returned an invalid matching response");
      }

      return parsed;
    } catch (error: unknown) {
      lastError = error;

      if (!isRetryableError(error) || attempt === maxAttempts) {
        break;
      }

      const delayMs = 1000 * 2 ** (attempt - 1);

      console.warn(
        `Gemini request failed. Retry ${attempt + 1}/${maxAttempts} in ${delayMs}ms.`
      );

      await sleep(delayMs);
    }
  }

  console.error("Candidate matching failed after retries.");

  if (isRetryableError(lastError)) {
    throw new Error(
      "AI service is temporarily busy. Please try again shortly."
    );
  }

  throw new Error(
    lastError instanceof Error
      ? lastError.message
      : "Candidate matching failed"
  );
};