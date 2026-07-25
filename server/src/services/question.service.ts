import prisma from "../config/prisma";
import { evaluateAnswer } from "./evaluation.service";

export const submitAnswer = async (
  questionId: string,
  answer: string
) => {
  const question = await prisma.question.findUnique({
    where: {
      id: questionId,
    },
  });

  if (!question) {
    throw new Error("Question not found");
  }

  const evaluation = await evaluateAnswer(
    question.question,
    answer
  );

  const updatedQuestion = await prisma.question.update({
    where: {
      id: questionId,
    },
    data: {
      answer,
      score: evaluation.score,
      feedback: evaluation.feedback,
      strengths: evaluation.strengths,
      improvements: evaluation.improvements,
      expectedAnswer: evaluation.expectedAnswer,
    },
  });

  return updatedQuestion;
};