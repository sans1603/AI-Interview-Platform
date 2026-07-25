import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { getDashboardData } from "../services/dashboard.service";

export const getDashboardHandler = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const dashboard = await getDashboardData(req.userId!);

    res.status(200).json({
      success: true,
      dashboard,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to load dashboard",
    });
  }
};