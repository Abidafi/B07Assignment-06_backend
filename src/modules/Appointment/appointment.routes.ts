import { Router } from "express";
import { AppointmentController } from "./appointment.controller.js";
import { auth } from "../../middlewares/auth.js";

const router = Router();
router.post("/", auth("STUDENT"), AppointmentController.bookAppointment);
router.get("/my-appointments", auth("STUDENT", "INSTRUCTOR"), AppointmentController.getMyAppointments);
router.patch("/:id/status", auth("INSTRUCTOR", "ADMIN"), AppointmentController.updateStatus);
router.get("/:id/invoice", auth("STUDENT"), AppointmentController.downloadInvoice);

export const appointmentRouter = router;