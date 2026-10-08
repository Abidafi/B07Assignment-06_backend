import { Router } from "express";
import { PaymentController } from "./payment.controller.js";
import { auth } from "../../middlewares/auth.js";
import express from "express";

const router = Router();
router.post("/initiate", auth("STUDENT"), PaymentController.initiatePayment);
router.post("/webhook", express.raw({ type: "application/json" }), PaymentController.handleWebhook);
router.get('/my-payments', auth("STUDENT","INSTRUCTOR"), PaymentController.getUserPayments);

export const paymentRouter = router;