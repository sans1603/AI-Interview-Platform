import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

interface EvaluationResult {
  score: number;
  feedback: string;
  strengths: string;
  improvements: string;
  expectedAnswer: string;
}

export const evaluateAnswer = async (
  question: string,
  answer: string
): Promise<EvaluationResult> => {
  const prompt = `
You are an expert technical interviewer.

Question:
${question}

Candidate's Answer:
${answer}

Evaluate the answer and return ONLY valid JSON in this format:

{
  "score": number,
  "feedback": "...",
  "strengths": "...",
  "improvements": "...",
  "expectedAnswer": "..."
}

Rules:
- Score should be between 0 and 10.
- Do not return markdown.
- Return JSON only.
`;

  const completion = await client.chat.completions.create({
    model: "openrouter/free",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.3,
  });

  const content = completion.choices[0].message.content;

  if (!content) {
    throw new Error("AI returned an empty response.");
  }

  return JSON.parse(content) as EvaluationResult;
};