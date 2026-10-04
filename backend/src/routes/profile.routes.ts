import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import * as controller from "../controllers/profile.controller";
import sectionRoutes from "./sections.routes";

const router = Router();

// Secure by default: every route in this file requires a logged-in user.
router.use(requireAuth);

router.get("/", controller.getProfile);
router.put("/", controller.updateProfile);

router.post("/experiences", controller.createExperience);
router.put("/experiences/:id", controller.updateExperience);
router.delete("/experiences/:id", controller.deleteExperience);

// educations, skills, projects, certifications, achievements
router.use(sectionRoutes);

export default router;