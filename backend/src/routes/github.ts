import { Router } from "express";
import { analyzeGitHub } from "../controllers/github.controller";
import { requireCurrentUser } from "../middleware/auth";

const router = Router();
router.use(requireCurrentUser);
router.post("/analyze", analyzeGitHub);

export default router;
