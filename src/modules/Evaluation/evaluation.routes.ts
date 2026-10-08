import { Router } from "express";
import { EvaluationController } from "./evaluation.controller.js";
import { auth } from "../../middlewares/auth.js";

const router = Router();
router.post("/", auth("INSTRUCTOR"), EvaluationController.createEvaluation);
router.get("/:id", auth("STUDENT", "INSTRUCTOR", "ADMIN"), EvaluationController.getEvaluationById);

export const evaluationRouter = router;