import type { Response } from "express";
import { type AuthenticatedRequest } from "../middleware/auth";
import { JobRepository } from "../repositories/job.repository";
import { JobParserService } from "../services/job-parser.service";
import { JobKeywordService } from "../services/job-keyword.service";
import { JobAnalysisService } from "../services/job-analysis.service";

const repo = new JobRepository();
const parser = new JobParserService();
const keywordService = new JobKeywordService();
const analysisService = new JobAnalysisService();

// ─── Helpers ──────────────────────────────────────────────────────────────────

function serializeJob(job: Awaited<ReturnType<JobRepository["findOwned"]>>) {
  if (!job) return null;
  return {
    ...job,
    parsedData: job.parsedData as Record<string, unknown> | null,
  };
}

// ─── Controller ───────────────────────────────────────────────────────────────

export class JobController {
  /** GET /api/jobs */
  async list(req: AuthenticatedRequest, res: Response): Promise<void> {
    const jobs = await repo.listByUserId(req.currentUser!.id);
    res.json({ data: jobs.map(serializeJob) });
  }

  /** GET /api/jobs/:id */
  async get(req: AuthenticatedRequest, res: Response): Promise<void> {
    const job = await repo.findOwned(req.params.id, req.currentUser!.id);
    if (!job) { res.status(404).json({ error: "Job not found" }); return; }

    // Also fetch related data
    const [keywords, analysis, linkedResumes] = await Promise.all([
      repo.getKeywordsByJobId(job.id),
      repo.getAnalysisByJobId(job.id),
      repo.getLinkedResumes(job.id),
    ]);

    res.json({
      data: {
        ...serializeJob(job),
        keywords,
        analysis,
        linkedResumes,
      },
    });
  }

  /** POST /api/jobs — create + auto-parse */
  async create(req: AuthenticatedRequest, res: Response): Promise<void> {
    const job = await repo.create(req.currentUser!.id, req.body);

    // Auto-parse in background (non-blocking for response)
    this._parseAndSave(job.id, job.rawDescription, { jobTitle: job.jobTitle, company: job.company }).catch(
      (err) => console.error(`[jobs] parse error for ${job.id}:`, err)
    );

    res.status(201).json({ data: serializeJob(job) });
  }

  /** PATCH /api/jobs/:id */
  async update(req: AuthenticatedRequest, res: Response): Promise<void> {
    const existing = await repo.findOwned(req.params.id, req.currentUser!.id);
    if (!existing) { res.status(404).json({ error: "Job not found" }); return; }

    const job = await repo.updateOwned(req.params.id, req.currentUser!.id, req.body);
    if (!job) { res.status(404).json({ error: "Job not found" }); return; }

    // Re-parse if rawDescription changed
    if (req.body.rawDescription && req.body.rawDescription !== existing.rawDescription) {
      this._parseAndSave(job.id, job.rawDescription, { jobTitle: job.jobTitle, company: job.company }).catch(
        (err) => console.error(`[jobs] re-parse error for ${job.id}:`, err)
      );
    }

    res.json({ data: serializeJob(job) });
  }

  /** DELETE /api/jobs/:id */
  async delete(req: AuthenticatedRequest, res: Response): Promise<void> {
    const deleted = await repo.deleteOwned(req.params.id, req.currentUser!.id);
    if (!deleted) { res.status(404).json({ error: "Job not found" }); return; }
    res.status(204).send();
  }

  /** POST /api/jobs/:id/analyze — force re-analysis */
  async analyze(req: AuthenticatedRequest, res: Response): Promise<void> {
    const job = await repo.findOwned(req.params.id, req.currentUser!.id);
    if (!job) { res.status(404).json({ error: "Job not found" }); return; }

    const result = await this._parseAndSave(job.id, job.rawDescription, {
      jobTitle: job.jobTitle,
      company: job.company,
    });

    const [keywords, analysis] = await Promise.all([
      repo.getKeywordsByJobId(job.id),
      repo.getAnalysisByJobId(job.id),
    ]);

    res.json({
      data: {
        parsed: result.parsed,
        keywords,
        analysis,
      },
    });
  }

  /** POST /api/jobs/:id/link-resume */
  async linkResume(req: AuthenticatedRequest, res: Response): Promise<void> {
    const job = await repo.findOwned(req.params.id, req.currentUser!.id);
    if (!job) { res.status(404).json({ error: "Job not found" }); return; }

    await repo.linkResume(job.id, req.body.resumeId as string);
    res.status(201).json({ data: { jobId: job.id, resumeId: req.body.resumeId } });
  }

  /** DELETE /api/jobs/:id/link-resume/:resumeId */
  async unlinkResume(req: AuthenticatedRequest, res: Response): Promise<void> {
    const job = await repo.findOwned(req.params.id, req.currentUser!.id);
    if (!job) { res.status(404).json({ error: "Job not found" }); return; }

    await repo.unlinkResume(job.id, req.params.resumeId);
    res.status(204).send();
  }

  // ─── Private helpers ────────────────────────────────────────────────────────

  private async _parseAndSave(
    jobId: string,
    rawDescription: string,
    hint?: { jobTitle?: string; company?: string },
  ) {
    // 1. Parse raw description
    const parsed = parser.parse(rawDescription, hint);

    // 2. Process keywords
    const keywords = keywordService.processKeywords(parsed, rawDescription);

    // 3. Analyze
    const analysis = analysisService.analyze(parsed, rawDescription);

    // 4. Persist concurrently (parsedData stored server-side — no ownership check needed)
    await Promise.all([
      repo.saveParsedData(jobId, parsed),
      repo.saveKeywords(jobId, keywords),
      repo.saveAnalysis(jobId, analysis),
    ]);

    return { parsed, keywords, analysis };
  }
}
