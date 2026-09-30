import { Router } from "express";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.get("/", requireAuth, (req, res) => {
  res.json({ success: true, user: req.user });
});

export default router;