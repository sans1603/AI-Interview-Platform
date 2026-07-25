import { Request, Response } from "express";
import { submitAnswer } from "../services/question.service";

export const submitAnswerHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const questionId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const { answer } = req.body;

    const question = await submitAnswer(
      questionId,
      answer
    );

    res.status(200).json({
      success: true,
      message: "Answer evaluated successfully",
      question,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to evaluate answer",
    });
  }
};