import type { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { ScheduleService } from "./schedule.service.js";

export const ScheduleController = {
  createSchedule: catchAsync(
    async (req: Request & { user?: any }, res: Response) => {
      const result = await ScheduleService.createSchedule(
        req.user.id,
        req.body,
      );
      sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Schedule created successfully",
        data: result,
      });
    },
  ),
  getAllSchedules: catchAsync(async (req: Request, res: Response) => {
    const result = await ScheduleService.getAllSchedules(req.query);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Schedules retrieved successfully",
      data: result,
    });
  }),
  getInstructorTodaySchedule: catchAsync(
    async (req: Request & { user?: any }, res: Response) => {
      const result = await ScheduleService.getInstructorTodaySchedule(
        req.user.id,
      );
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Today's schedule retrieved successfully",
        data: result,
      });
    },
  ),
  deleteSchedule: catchAsync(
    async (req: Request & { user?: any }, res: Response) => {
      const result = await ScheduleService.softDeleteSchedule(
        req.params.id as string,
        req.user.id,
      );
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Schedule deleted successfully",
        data: result,
      });
    },
  ),
  updateSchedule: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = req.user as { userId: string };

    const result = await ScheduleService.updateScheduleService(id as string, user.userId, req.body);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Schedule slot updated successfully",
      data: result,
    });
  }),
};
