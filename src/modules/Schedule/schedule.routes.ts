import { Router } from "express";
import { ScheduleController } from "./schedule.controller.js";
import { auth } from "../../middlewares/auth.js";

const router = Router();
router.post("/", auth("INSTRUCTOR"), ScheduleController.createSchedule);
router.get("/", ScheduleController.getAllSchedules);
router.get("/instructor/today", auth("INSTRUCTOR"), ScheduleController.getInstructorTodaySchedule);
router.delete("/:id", auth("INSTRUCTOR"), ScheduleController.deleteSchedule);
router.patch('/:id', auth("INSTRUCTOR"), ScheduleController.updateSchedule);

export const scheduleRouter = router;