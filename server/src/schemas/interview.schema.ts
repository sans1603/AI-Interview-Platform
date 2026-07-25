import { z } from "zod";

export const createInterviewSchema = z.object({
  title: z.string().min(3),
  role: z.string().min(2),
  experienceLevel: z.string().min(1),
  techStack: z.string().min(2),
  totalQuestions: z.number().int().positive(),
});

export type CreateInterviewInput = z.infer<
  typeof createInterviewSchema
>;