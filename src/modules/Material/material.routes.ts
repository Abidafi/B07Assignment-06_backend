import { Router } from "express";
import { PublicContentController } from "./material.controller.js";

const router = Router();
router.get("/instructors", PublicContentController.getInstructors);
router.get("/materials/search", PublicContentController.searchMaterials);

export const publicContentRouter = router;