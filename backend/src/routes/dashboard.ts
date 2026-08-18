import { Router } from "express";
import { getDashboardStats } from "../controllers/dashboard.controller";
import { requireCurrentUser } from "../middleware/auth";

const router = Router();
router.use(requireCurrentUser);
router.get("/stats", getDashboardStats);

export default router;
