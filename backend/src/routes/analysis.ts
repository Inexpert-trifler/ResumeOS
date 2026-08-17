import { Router } from "express";
import { analyzeResume, generateAiSuggestions } from "../controllers/analysis.controller";
import { requireCurrentUser } from "../middleware/auth";

const router = Router();

router.use(requireCurrentUser);

router.post("/", analyzeResume);
router.post("/:id/ai-suggestions", generateAiSuggestions);

export default router;
