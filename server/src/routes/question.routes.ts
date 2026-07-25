import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { submitAnswerHandler } from "../controllers/question.controller";

const router = Router();

router.post(
  "/:id/answer",
  authenticate,
  submitAnswerHandler
);

export default router;