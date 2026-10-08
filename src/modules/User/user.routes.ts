import { Router } from "express";
import { UserController } from "./user.controller.js";
import { auth } from "../../middlewares/auth.js";
import { upload } from "../../config/cloudinary.js";

const router = Router();
router.get("/me", auth("STUDENT", "INSTRUCTOR", "ADMIN"), UserController.getProfile);
router.patch("/me", auth("STUDENT", "INSTRUCTOR", "ADMIN"), UserController.updateProfile);
router.patch("/me/avatar", auth("STUDENT", "INSTRUCTOR", "ADMIN"), upload.single("avatar"), UserController.updateAvatar);

export const userRouter = router;