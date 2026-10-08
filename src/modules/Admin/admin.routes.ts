import { Router } from "express";
import { AdminController } from "./admin.controller.js";
import { auth } from "../../middlewares/auth.js";

const router = Router();
router.get("/dashboard-stats", auth("ADMIN"), AdminController.getDashboardStats);
router.get("/users", auth("ADMIN"), AdminController.getAllUsers);
router.patch("/users/:id/role", auth("ADMIN"), AdminController.updateUserRole);
router.get("/audit-logs", auth("ADMIN"), AdminController.getAuditLogs);

export const adminRouter = router;