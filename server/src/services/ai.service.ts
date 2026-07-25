import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export const generateInterviewQuestions = async (
  role: string,
  experienceLevel: string,
  techStack: string,
  totalQuestions: number
) => {
  const prompt = `
Generate exactly ${totalQuestions} technical interview questions.

Role: ${role}
Experience Level: ${experienceLevel}
Tech Stack: ${techStack}

Rules:
- Return ONLY a valid JSON array.
- Do not include markdown.
- Do not number the questions.
- Each item should be:
{
  "question": "..."
}
`;

  const completion = await client.chat.completions.create({
    model: "openrouter/free",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.7,
  });

  const content = completion.choices[0].message.content;

  if (!content) {
    throw new Error("AI did not return any questions.");
  }

  return JSON.parse(content);
};

interface InterviewAnswer {
  questionId: string;
  question: string;
  answer: string;
}

export const evaluateInterview = async (
  answers: InterviewAnswer[]
) => {
  const prompt = `
You are a senior technical interviewer.

Evaluate the following interview.

${answers
  .map(
    (a, index) => `
Question ${index + 1}
${a.question}

Candidate Answer
${a.answer}
`
  )
  .join("\n")}

Return ONLY valid JSON.

{
  "overallScore": 8.5,
  "overallFeedback": "...",
  "strengths": [
    "...",
    "...",
    "..."
  ],
  "improvements": [
    "...",
    "...",
    "..."
  ],
  "questions": [
    {
      "questionId":"${answers[0]?.questionId ?? ""}",
      "score":8,
      "feedback":"..."
    }
  ]
}

Rules:
- overallScore between 0 and 10.
- Score every question.
- Return one question object for every question.
- Do not include markdown.
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
    throw new Error("AI evaluation failed.");
  }

  return JSON.parse(content);
};