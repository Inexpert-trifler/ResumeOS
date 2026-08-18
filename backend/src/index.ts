import { config } from "dotenv";
import { resolve } from "path";

// Explicitly load the single root .env.local — works regardless of CWD.
// __dirname here is backend/src/, so ../.. resolves to the project root.
config({ path: resolve(__dirname, "../../.env.local") });
import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import compression from "compression";
import { clerkMiddleware } from "@clerk/express";

import healthRouter from "./routes/health";
import exportPdfRouter from "./routes/exportPdf";
import resumesRouter from "./routes/resumes";
import jobsRouter from "./routes/jobs";
import analysisRouter from "./routes/analysis";
import aiRouter from "./routes/ai";
import coachRouter from "./routes/coach";
import coverLettersRouter from "./routes/cover-letters";
import interviewsRouter from "./routes/interviews";
import roadmapsRouter from "./routes/roadmaps";
import settingsRouter from "./routes/settings";
import githubRouter from "./routes/github";
import linkedinRouter from "./routes/linkedin";
import dashboardRouter from "./routes/dashboard";

const url = process.env.DATABASE_URL;
// Safe diagnostic — never prints the actual URL value
const configured = Boolean(url && url.trim().length > 0);
const validFormat = configured && (
  (url as string).startsWith("postgresql://") ||
  (url as string).startsWith("postgres://")
);
console.log("[database] DATABASE_URL configured:", configured);
console.log("[database] DATABASE_URL valid format:", validFormat);

const clerkSecretKeyConfigured = Boolean(process.env.CLERK_SECRET_KEY);
const clerkPublishableKeyConfigured = Boolean(process.env.CLERK_PUBLISHABLE_KEY);
console.log("[clerk] secret key configured:", clerkSecretKeyConfigured);
console.log("[clerk] publishable key configured:", clerkPublishableKeyConfigured);

const groqApiKeyConfigured = Boolean(process.env.GROQ_API_KEY && process.env.GROQ_API_KEY.trim().length > 0);
const groqModelConfigured = Boolean(process.env.GROQ_MODEL && process.env.GROQ_MODEL.trim().length > 0);
console.log("[AI] GROQ_API_KEY configured:", groqApiKeyConfigured);
console.log("[AI] GROQ_MODEL configured:", groqModelConfigured);

const app = express();
const PORT = parseInt(process.env.PORT ?? "4000", 10);
const allowedOrigins = (process.env.FRONTEND_URL ?? "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

// Default common development and production origins fallback if FRONTEND_URL is set narrowly
if (!allowedOrigins.includes("https://resume-os-six.vercel.app")) {
  allowedOrigins.push("https://resume-os-six.vercel.app");
}
if (!allowedOrigins.includes("http://localhost:3000")) {
  allowedOrigins.push("http://localhost:3000");
}

// ── Security & middleware ─────────────────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false })); // CSP off — we serve raw HTML for PDF
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or server-to-server)
      if (!origin) {
        return callback(null, true);
      }

      // Check explicit allowlist
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Check Vercel preview deployment URLs pattern (e.g., https://resume-*.vercel.app)
      try {
        const parsed = new URL(origin);
        if (
          parsed.protocol === "https:" &&
          (/^resume-.*\.vercel\.app$/.test(parsed.hostname) ||
            parsed.hostname.endsWith(".vercel.app"))
        ) {
          return callback(null, true);
        }
      } catch {
        // invalid URL format
      }

      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);
app.options("*", cors() as unknown as express.RequestHandler);
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(compression());
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(clerkMiddleware());

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api/health", healthRouter);
app.use("/api/export-pdf", exportPdfRouter);
app.use("/api/resumes", resumesRouter);
app.use("/api/jobs", jobsRouter);
app.use("/api/analysis", analysisRouter);
app.use("/api/ai", aiRouter);
app.use("/api/coach", coachRouter);
app.use("/api/cover-letters", coverLettersRouter);
app.use("/api/interviews", interviewsRouter);
app.use("/api/roadmaps", roadmapsRouter);
app.use("/api/settings", settingsRouter);
app.use("/api/github", githubRouter);
app.use("/api/linkedin", linkedinRouter);
app.use("/api/dashboard", dashboardRouter);

// 404 fallback
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Global error handler
app.use((err: Error & { status?: number }, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("[error]", err.message);
  res.status(err.status ?? 500).json({ error: err.status ? err.message : "Internal server error" });
});

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n  ResumeOS API — Sprint 3`);
  console.log(`  ▲ Running on http://localhost:${PORT}`);
  console.log(`  ✓ Health  → GET  http://localhost:${PORT}/api/health`);
  console.log(`  ✓ PDF     → POST http://localhost:${PORT}/api/export-pdf`);
  console.log(`  ✓ Jobs    → CRUD http://localhost:${PORT}/api/jobs`);
  console.log(`  ✓ CORS allowed from ${allowedOrigins.join(", ")}\n`);
});

export default app;

