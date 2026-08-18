import type { Response } from "express";
import { type AuthenticatedRequest } from "../middleware/auth";
import { CoverLetterRepository } from "../repositories/cover-letter.repository";
import { ResumeService } from "../services/resume.service";
import { JobRepository } from "../repositories/job.repository";
import { AIService } from "../services/ai.service";

const coverLetterRepo = new CoverLetterRepository();
const resumeService = new ResumeService();
const jobRepo = new JobRepository();

export class CoverLetterController {
  /**
   * POST /api/cover-letters (Generate structured cover letter preview & save record)
   */
  async generate(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.currentUser!.id;
      const { resumeId, jobId, company, role, jobTitle, jobDescription, tone, instructions } = req.body;

      let targetCompany = typeof company === "string" ? company.trim() : "";
      let targetRole = typeof role === "string" && role.trim() ? role.trim() : typeof jobTitle === "string" ? jobTitle.trim() : "";
      let targetDescription = typeof jobDescription === "string" ? jobDescription.trim() : "";
      let verifiedJobId = jobId;

      // 1. Ownership & Job Lookup if jobId provided
      if (jobId && typeof jobId === "string") {
        const jobRecord = await jobRepo.findOwned(jobId, userId);
        if (!jobRecord) {
          res.status(404).json({ success: false, error: "Tracked job not found or unauthorized access." });
          return;
        }
        verifiedJobId = jobRecord.id;
        if (!targetCompany) targetCompany = jobRecord.company;
        if (!targetRole) targetRole = jobRecord.jobTitle;
        if (!targetDescription) targetDescription = jobRecord.rawDescription;
      }

      if (!targetCompany || !targetRole) {
        res.status(400).json({ success: false, error: "Target company and role/title are required." });
        return;
      }

      // 2. Ownership & Resume Context Lookup
      let activeResumeId = resumeId;
      let resumeContext: Record<string, unknown> | null = null;

      if (resumeId && typeof resumeId === "string") {
        const resume = await resumeService.get(resumeId, userId);
        if (!resume) {
          res.status(404).json({ success: false, error: "Selected resume not found or unauthorized access." });
          return;
        }
        activeResumeId = resume.id;
        resumeContext = resume.resumeJson as Record<string, unknown>;
      } else {
        const userResumes = await resumeService.list(userId);
        if (userResumes.length > 0) {
          activeResumeId = userResumes[0].id;
          resumeContext = userResumes[0].resumeJson as Record<string, unknown>;
        }
      }

      if (!resumeContext || !activeResumeId) {
        res.status(400).json({ success: false, error: "Please save or select a resume before generating a cover letter." });
        return;
      }

      // 3. Generate structured cover letter using Groq grounded in resume facts
      const result = await AIService.generateCoverLetter({
        resumeContext,
        company: targetCompany,
        role: targetRole,
        jobDescription: targetDescription,
        tone: tone || "professional",
        instructions,
      });

      // 4. Save generated cover letter record to database
      const title = `${targetRole} at ${targetCompany}`;
      const record = await coverLetterRepo.createCoverLetter({
        userId,
        resumeId: activeResumeId,
        jobId: verifiedJobId,
        title,
        content: result.coverLetter,
        tone: tone || "professional",
      });

      res.status(201).json({
        success: true,
        data: {
          ...record,
          subject: result.subject,
          personalizationPoints: result.personalizationPoints,
          warnings: result.warnings,
          coverLetter: result.coverLetter,
        },
      });
    } catch (error) {
      console.error("[CoverLetterController] generate error:", error);
      const message = error instanceof Error ? error.message : "Failed to generate cover letter.";
      const isRateLimit = message.toLowerCase().includes("rate limit");
      const isMissingKey = message.toLowerCase().includes("groq_api_key");

      res.status(isRateLimit ? 429 : 500).json({
        success: false,
        error: {
          code: isRateLimit ? "AI_RATE_LIMIT" : isMissingKey ? "MISSING_API_KEY" : "COVER_LETTER_ERROR",
          message,
        },
      });
    }
  }

  /**
   * GET /api/cover-letters (List user's cover letters)
   */
  async list(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.currentUser!.id;
      const letters = await coverLetterRepo.listCoverLetters(userId);
      res.json({ success: true, data: letters });
    } catch (error) {
      console.error("[CoverLetterController] list error:", error);
      res.status(500).json({ success: false, error: "Failed to list cover letters." });
    }
  }

  /**
   * GET /api/cover-letters/:id
   */
  async get(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.currentUser!.id;
      const { id } = req.params;

      const letter = await coverLetterRepo.getCoverLetter(id, userId);
      if (!letter) {
        res.status(404).json({ success: false, error: "Cover letter not found." });
        return;
      }

      res.json({ success: true, data: letter });
    } catch (error) {
      console.error("[CoverLetterController] get error:", error);
      res.status(500).json({ success: false, error: "Failed to fetch cover letter." });
    }
  }

  /**
   * PATCH /api/cover-letters/:id
   */
  async update(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.currentUser!.id;
      const { id } = req.params;
      const { content } = req.body;

      if (!content || typeof content !== "string") {
        res.status(400).json({ success: false, error: "Content is required." });
        return;
      }

      const updated = await coverLetterRepo.updateCoverLetter(id, userId, content.trim());
      if (!updated) {
        res.status(404).json({ success: false, error: "Cover letter not found." });
        return;
      }

      res.json({ success: true, data: updated });
    } catch (error) {
      console.error("[CoverLetterController] update error:", error);
      res.status(500).json({ success: false, error: "Failed to update cover letter." });
    }
  }

  /**
   * DELETE /api/cover-letters/:id
   */
  async delete(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.currentUser!.id;
      const { id } = req.params;

      const deleted = await coverLetterRepo.deleteCoverLetter(id, userId);
      if (!deleted) {
        res.status(404).json({ success: false, error: "Cover letter not found." });
        return;
      }

      res.json({ success: true, message: "Cover letter deleted." });
    } catch (error) {
      console.error("[CoverLetterController] delete error:", error);
      res.status(500).json({ success: false, error: "Failed to delete cover letter." });
    }
  }
}
