import type { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { AdminService } from "./admin.service.js";

export const AdminController = {
  getDashboardStats: catchAsync(async (req: Request, res: Response) => {
    const result = await AdminService.getDashboardStats();
    sendResponse(res, { statusCode: 200, success: true, message: "Dashboard analytics retrieved", data: result });
  }),
  getAllUsers: catchAsync(async (req: Request, res: Response) => {
    const result = await AdminService.getAllUsers(req.query);
    sendResponse(res, { statusCode: 200, success: true, message: "Users retrieved successfully", data: result });
  }),
  updateUserRole: catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const result = await AdminService.updateUserRole(req.user.id, req.params.id as string, req.body.role, req.ip);
    sendResponse(res, { statusCode: 200, success: true, message: "User role updated successfully", data: result });
  }),
  getAuditLogs: catchAsync(async (req: Request, res: Response) => {
    const result = await AdminService.getAuditLogs();
    sendResponse(res, { statusCode: 200, success: true, message: "Audit logs retrieved successfully", data: result });
  }),
};