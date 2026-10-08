import type { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { AppointmentService } from "./appointment.service.js";
import { generatePdfInvoice } from "../../utils/pdfInvoiceGenerator.js";

export const AppointmentController = {
  bookAppointment: catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const result = await AppointmentService.bookAppointment(req.user.id, req.body.scheduleId);
    sendResponse(res, { statusCode: 201, success: true, message: "Appointment booked successfully", data: result });
  }),
  getMyAppointments: catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const result = await AppointmentService.getMyAppointments(req.user.id, req.user.role);
    sendResponse(res, { statusCode: 200, success: true, message: "Appointments retrieved successfully", data: result });
  }),
  updateStatus: catchAsync(async (req: Request, res: Response) => {
    const result = await AppointmentService.updateAppointmentStatus(req.params.id as string, req.body.status);
    sendResponse(res, { statusCode: 200, success: true, message: "Appointment status updated", data: result });
  }),
  downloadInvoice: catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const appointment = await AppointmentService.getInvoice(req.params.id as string, req.user.id);
    generatePdfInvoice(appointment, res);
  }),
};