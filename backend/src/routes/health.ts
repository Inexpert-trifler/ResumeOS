import { Router, Request, Response } from "express";

const router = Router();

/**
 * GET /api/health
 * Simple liveness check — returns service status and timestamp.
 */
router.get("/", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    service: "ResumeOS API",
    version: "1.0.0",
    sprint: "Sprint 1",
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
  });
});

export default router;
