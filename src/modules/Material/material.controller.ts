import type { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { PublicContentService } from "./material.service.js";

export const PublicContentController = {
  getInstructors: catchAsync(async (req: Request, res: Response) => {
    const result = await PublicContentService.getPublicInstructors(req.query);
    sendResponse(res, { statusCode: 200, success: true, message: "Instructors retrieved successfully", data: result });
  }),
  searchMaterials: catchAsync(async (req: Request, res: Response) => {
    const query = (req.query.q as string) || "";
    const result = await PublicContentService.searchMaterials(query);
    sendResponse(res, { statusCode: 200, success: true, message: "Materials searched successfully", data: result });
  }),
};