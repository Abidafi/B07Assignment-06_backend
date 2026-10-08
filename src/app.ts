import express from "express";
import type { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import globalErrorHandler from "./middlewares/globalErrorHandler.js";
import notFound from "./middlewares/notFound.js";

import { authRouter } from "./modules/Auth/auth.routes.js";
import { userRouter } from "./modules/User/user.routes.js";
import { scheduleRouter } from "./modules/Schedule/schedule.routes.js";
import { appointmentRouter } from "./modules/Appointment/appointment.routes.js";
import { evaluationRouter } from "./modules/Evaluation/evaluation.routes.js";
import { paymentRouter } from "./modules/Payment/payment.routes.js";
import { publicContentRouter } from "./modules/Material/material.routes.js";
import { adminRouter } from "./modules/Admin/admin.routes.js";

const app: Application = express();

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));

app.use(
  express.json({
    verify: (req: Request & { rawBody?: Buffer }, res, buf) => {
      req.rawBody = buf;
    },
  })
);
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use("/api/", limiter);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Welcome to IELTS Preparation Platform Backend API!",
  });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/schedules", scheduleRouter);
app.use("/api/v1/appointments", appointmentRouter);
app.use("/api/v1/evaluations", evaluationRouter);
app.use("/api/v1/payments", paymentRouter);
app.use("/api/v1", publicContentRouter);
app.use("/api/v1/admin", adminRouter);

app.use(notFound);
app.use(globalErrorHandler);

export default app;