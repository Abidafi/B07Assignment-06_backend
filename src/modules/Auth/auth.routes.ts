import { Router } from "express";
import { AuthController } from "./auth.controller.js";

const router = Router();
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/google", AuthController.googleLogin);
router.post("/forgot-password", AuthController.forgotPassword);
router.post("/reset-password", AuthController.resetPassword);
router.post("/refresh-token", AuthController.refreshToken);
router.post("/logout", AuthController.logout);

export const authRouter = router;