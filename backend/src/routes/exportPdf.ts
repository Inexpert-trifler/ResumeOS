import { Router, Request, Response } from "express";
import { ExportPdfRequest } from "../types/resume";
import { buildResumeHtml } from "../utils/buildResumeHtml";

const router = Router();

/**
 * POST /api/export-pdf
 *
 * Sprint 1: Returns a rendered HTML document as a PDF-ready page.
 * The frontend can display it in an iframe or open it in a print dialog.
 *
 * Sprint 2 will replace this with a headless-browser (Puppeteer) PDF renderer.
 *
 * Body: { resume: ResumeData, settings: StudioSettings }
 * Response: HTML document (text/html) — client triggers window.print()
 */
router.post("/", (req: Request, res: Response) => {
  const body = req.body as ExportPdfRequest;

  if (!body?.resume || !body?.settings) {
    res.status(400).json({ error: "Missing resume or settings in request body" });
    return;
  }

  try {
    const html = buildResumeHtml(body.resume, body.settings);

    // Send printable HTML back — client opens in a new window and calls print()
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Content-Disposition", `inline; filename="${(body.resume.header.name || "resume").replace(/\s+/g, "_")}.html"`);
    res.send(html);
  } catch (err) {
    console.error("[export-pdf] Error generating HTML:", err);
    res.status(500).json({ error: "Failed to generate resume document" });
  }
});

export default router;
