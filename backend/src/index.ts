import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import compression from "compression";

import healthRouter from "./routes/health";
import exportPdfRouter from "./routes/exportPdf";

const app = express();
const PORT = parseInt(process.env.PORT ?? "4000", 10);
const FRONTEND_URL = process.env.FRONTEND_URL ?? "http://localhost:3000";

// ── Security & middleware ─────────────────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false })); // CSP off — we serve raw HTML for PDF
app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(compression());
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api/health", healthRouter);
app.use("/api/export-pdf", exportPdfRouter);

// 404 fallback
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Global error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("[error]", err.message);
  res.status(500).json({ error: "Internal server error" });
});

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n  ResumeOS API — Sprint 1`);
  console.log(`  ▲ Running on http://localhost:${PORT}`);
  console.log(`  ✓ Health  → GET  http://localhost:${PORT}/api/health`);
  console.log(`  ✓ PDF     → POST http://localhost:${PORT}/api/export-pdf`);
  console.log(`  ✓ CORS allowed from ${FRONTEND_URL}\n`);
});

export default app;
