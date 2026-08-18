import { Router } from "express";
import { improveContent, getAiHealth, testGroq } from "../controllers/ai.controller";
import { requireCurrentUser } from "../middleware/auth";

const router = Router();

// Public health check for AI status & configuration (no auth required)
router.get("/health", getAiHealth);

// Authenticated AI routes
router.use(requireCurrentUser);
router.post("/test", testGroq);
router.post("/improve", improveContent);

export default router;
