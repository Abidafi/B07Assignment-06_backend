import type { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { UserService } from "./user.service.js";

export const UserController = {
  getProfile: catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const result = await UserService.getProfile(req.user.id);
    sendResponse(res, { statusCode: 200, success: true, message: "Profile retrieved successfully", data: result });
  }),
  updateProfile: catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const result = await UserService.updateProfile(req.user.id, req.body);
    sendResponse(res, { statusCode: 200, success: true, message: "Profile updated successfully", data: result });
  }),
  updateAvatar: catchAsync(async (req: Request & { user?: any }, res: Response) => {
    if (!req.file) throw new Error("Avatar image file required");
    const result = await UserService.updateAvatar(req.user.id, req.file);
    sendResponse(res, { statusCode: 200, success: true, message: "Avatar updated successfully", data: result });
  }),
};