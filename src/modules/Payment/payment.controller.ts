import type { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { PaymentService } from "./payment.service.js";

export const PaymentController = {
  initiatePayment: catchAsync(
    async (req: Request & { user?: any }, res: Response) => {
      const result = await PaymentService.initiatePayment(
        req.user.id,
        req.body.appointmentId,
        req.body.amount,
      );
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Checkout session created",
        data: result,
      });
    },
  ),
  handleWebhook: async (req: Request & { rawBody?: Buffer }, res: Response) => {
    const signature = req.headers["stripe-signature"] as string;
    try {
      if (!req.rawBody) throw new Error("Raw body missing");
      const result = await PaymentService.handleWebhookEvent(
        req.rawBody,
        signature,
      );
      res.status(200).json({ received: true, result });
    } catch (error: any) {
      res.status(400).send(`Webhook Error: ${error.message}`);
    }
  },
  getUserPayments: catchAsync(async (req: Request, res: Response) => {
    const user = req.user as { userId: string };
    const result = await PaymentService.getUserPaymentsService(user.userId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Payment history retrieved successfully",
      data: result,
    });
  }),
};
