import type { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { EvaluationService } from "./evaluation.service.js";

export const EvaluationController = {
  createEvaluation: catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const result = await EvaluationService.createEvaluation(req.user.id, req.body);
    sendResponse(res, { statusCode: 201, success: true, message: "Evaluation submitted successfully", data: result });
  }),
  getEvaluationById: catchAsync(async (req: Request, res: Response) => {
    const result = await EvaluationService.getEvaluationById(req.params.id as string);
    sendResponse(res, { statusCode: 200, success: true, message: "Evaluation retrieved successfully", data: result });
  }),
};