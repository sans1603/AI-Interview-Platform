import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import {
  createInterview,
  getInterviewById,
  completeInterview,
  getUserInterviews,
  submitInterview,
  deleteInterview,
} from "../services/interview.service";

export const createInterviewHandler = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const {
      title,
      role,
      experienceLevel,
      techStack,
      totalQuestions,
    } = req.body;

    const interview = await createInterview({
      userId: req.userId!,
      title,
      role,
      experienceLevel,
      techStack,
      totalQuestions,
    });

    res.status(201).json({
      success: true,
      message: "Interview created successfully",
      interview,
    });
  } catch (error) {
    console.error("Create Interview Error:", error);

    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create interview",
    });
  }
};

export const getInterviewHandler = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const interviewId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const interview = await getInterviewById(
      interviewId,
      req.userId!
    );

    res.status(200).json({
      success: true,
      interview,
    });
  } catch (error) {
    console.error("Get Interview Error:", error);

    res.status(404).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Interview not found",
    });
  }
};

export const submitInterviewHandler = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const interviewId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const { answers } = req.body;

    const interview = await submitInterview(
      interviewId,
      req.userId!,
      answers
    );

    res.status(200).json({
      success: true,
      message: "Interview evaluated successfully",
      interview,
    });
  } catch (error) {
    console.error("Submit Interview Error:", error);

    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to evaluate interview",
    });
  }
};

export const completeInterviewHandler = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const interviewId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const interview = await completeInterview(
      interviewId,
      req.userId!
    );

    res.status(200).json({
      success: true,
      message: "Interview completed successfully",
      interview,
    });
  } catch (error) {
    console.error("Complete Interview Error:", error);

    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to complete interview",
    });
  }
};

export const getUserInterviewsHandler = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const interviews = await getUserInterviews(req.userId!);

    res.status(200).json({
      success: true,
      interviews,
    });
  } catch (error) {
    console.error("Get User Interviews Error:", error);

    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to fetch interviews",
    });
  }
};

export const deleteInterviewHandler = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const interviewId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const result = await deleteInterview(
      interviewId,
      req.userId!
    );

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Delete Interview Error:", error);

    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to delete interview",
    });
  }
};