import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import prisma from "./config/prisma";

import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import interviewRoutes from "./routes/interview.routes";
import dashboardRoutes from "./routes/dashboard.routes";

import questionRoutes from "./routes/question.routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/interviews", interviewRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/", async (_req: Request, res: Response) => {
  const userCount = await prisma.user.count();

  res.json({
    success: true,
    message: "AI Interview Platform API is running 🚀",
    totalUsers: userCount,
  });
});

export default app;