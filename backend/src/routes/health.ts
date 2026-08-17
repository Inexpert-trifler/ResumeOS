import { Router, Request, Response } from "express";
import { sql } from "drizzle-orm";
import { db, pool } from "../db";

const router = Router();

/**
 * GET /api/health
 * Liveness check — no database required.
 */
router.get("/", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    service: "ResumeOS API",
    version: "3.0.0",
    sprint: "Sprint 3",
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
  });
});

/**
 * GET /api/health/db
 * Executes a real PostgreSQL query via Drizzle.
 * Returns connected/disconnected — never exposes credentials.
 */
router.get("/db", async (_req: Request, res: Response) => {
  if (!process.env.DATABASE_URL) {
    res.status(503).json({
      status: "error",
      database: "not_configured",
      message: "DATABASE_URL is not set. Add it to the root .env.local.",
    });
    return;
  }

  try {
    // Real query through Drizzle — SELECT 1
    await db.execute(sql`SELECT 1`);
    res.json({
      status: "ok",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[health/db] Database connection failed:", message);
    res.status(503).json({
      status: "error",
      database: "disconnected",
      message: "Database query failed. Check DATABASE_URL and Supabase connectivity.",
    });
  }
});

export default router;
