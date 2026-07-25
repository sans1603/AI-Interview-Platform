import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { createInterviewSchema } from "../schemas/interview.schema";
import {
  createInterviewHandler,
  getInterviewHandler,
  completeInterviewHandler,
  getUserInterviewsHandler,
  submitInterviewHandler,
  deleteInterviewHandler,
} from "../controllers/interview.controller";

const router = Router();

router.post(
  "/",
  authenticate,
  validate(createInterviewSchema),
  createInterviewHandler
);

router.get(
  "/",
  authenticate,
  getUserInterviewsHandler
);

router.get(
  "/:id",
  authenticate,
  getInterviewHandler
);

router.post(
  "/:id/submit",
  authenticate,
  submitInterviewHandler
);

router.patch(
  "/:id/complete",
  authenticate,
  completeInterviewHandler
);

router.delete(
  "/:id",
  authenticate,
  deleteInterviewHandler
);

export default router;