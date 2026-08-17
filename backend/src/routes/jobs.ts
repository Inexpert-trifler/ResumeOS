import { Router } from "express";
import { JobController } from "../controllers/job.controller";
import { requireCurrentUser } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import { createJobSchema, updateJobSchema, linkResumeSchema } from "../validation/job.validation";

const router = Router();
const controller = new JobController();

// All routes require authentication
router.use(requireCurrentUser);

// ─── Collection ───────────────────────────────────────────────────────────────
router.get("/", controller.list.bind(controller));
router.post("/", validateBody(createJobSchema), controller.create.bind(controller));

// ─── Single resource ──────────────────────────────────────────────────────────
router.get("/:id", controller.get.bind(controller));
router.patch("/:id", validateBody(updateJobSchema), controller.update.bind(controller));
router.delete("/:id", controller.delete.bind(controller));

// ─── Actions ──────────────────────────────────────────────────────────────────
router.post("/:id/analyze", controller.analyze.bind(controller));

// ─── Resume links ─────────────────────────────────────────────────────────────
router.post("/:id/link-resume", validateBody(linkResumeSchema), controller.linkResume.bind(controller));
router.delete("/:id/link-resume/:resumeId", controller.unlinkResume.bind(controller));

export default router;
