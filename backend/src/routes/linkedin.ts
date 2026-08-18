import { Router } from "express";
import { analyzeLinkedIn } from "../controllers/linkedin.controller";
import { requireCurrentUser } from "../middleware/auth";

const router = Router();
router.use(requireCurrentUser);
router.post("/analyze", analyzeLinkedIn);

export default router;
