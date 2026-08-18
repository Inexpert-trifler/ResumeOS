import type { Response } from "express";
import { type AuthenticatedRequest } from "../middleware/auth";
import { RoadmapRepository } from "../repositories/roadmap.repository";
import { ResumeService } from "../services/resume.service";
import { AIService } from "../services/ai.service";
import { db } from "../db";
import { resumeAnalysis, jobDescriptions } from "../db/schema";
import { eq, desc, and } from "drizzle-orm";

const roadmapRepo = new RoadmapRepository();
const resumeService = new ResumeService();

export class RoadmapController {
  /**
   * POST /api/roadmaps
   */
  async generateRoadmap(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.currentUser!.id;
      const { targetRole, jobId } = req.body;

      const role = typeof targetRole === "string" && targetRole.trim() ? targetRole.trim() : "Software Engineer";

      // 1. Fetch user's latest resume for context
      let resumeContext: Record<string, unknown> | null = null;
      const userResumes = await resumeService.list(userId);
      if (userResumes.length > 0) {
        resumeContext = userResumes[0].resumeJson as Record<string, unknown>;
      }

      // 2. Optionally fetch job description if jobId provided
      let jobDescription: string | undefined;
      if (jobId && typeof jobId === "string") {
        const [job] = await db
          .select()
          .from(jobDescriptions)
          .where(and(eq(jobDescriptions.id, jobId), eq(jobDescriptions.userId, userId)))
          .limit(1);
        if (job) {
          jobDescription = job.rawDescription;
        }
      } else if (userResumes.length > 0) {
        // Try to pull missing skills from latest ATS analysis to enrich the roadmap prompt
        const [latestAnalysis] = await db
          .select()
          .from(resumeAnalysis)
          .where(eq(resumeAnalysis.resumeId, userResumes[0].id))
          .orderBy(desc(resumeAnalysis.createdAt))
          .limit(1);
        if (latestAnalysis && Array.isArray(latestAnalysis.weaknesses) && latestAnalysis.weaknesses.length > 0) {
          jobDescription = `Key missing skills to address: ${(latestAnalysis.weaknesses as string[]).slice(0, 8).join(", ")}.`;
        }
      }

      // 3. Generate structured roadmap with Groq — returns StructuredRoadmapResult
      const result = await AIService.generateCareerRoadmap({
        resumeContext,
        targetRole: role,
        jobDescription,
      });

      // 4. Convert roadmap phases → flat item list for persistence
      const itemsToSave = result.roadmap.flatMap((phase) =>
        phase.milestones.map((milestone) => ({
          title: milestone.title,
          description: milestone.description,
          category: phase.title,
          priority: phase.difficulty === "hard" ? "high" : phase.difficulty === "medium" ? "medium" : "low",
          estimatedTime: "1-2 weeks",
          skills: phase.skills,
          resources: [],
        }))
      );

      // 5. Persist roadmap and items to database
      const roadmap = await roadmapRepo.createRoadmap(userId, role);
      const savedItems = await roadmapRepo.saveItems(roadmap.id, itemsToSave);

      res.status(201).json({
        success: true,
        data: {
          roadmap,
          items: savedItems,
          progress: 0,
          // Include full AI result for rich frontend display
          aiResult: {
            summary: result.summary,
            readinessScore: result.readinessScore,
            skillGaps: result.skillGaps,
            roadmapPhases: result.roadmap,
            projects: result.projects,
            interviewPreparation: result.interviewPreparation,
          },
        },
      });
    } catch (error) {
      console.error("[RoadmapController] generateRoadmap error:", error);
      const message = error instanceof Error ? error.message : "Failed to generate career roadmap.";
      const isRateLimit = message.toLowerCase().includes("rate limit");
      res.status(isRateLimit ? 429 : 500).json({ success: false, error: message });
    }
  }

  /**
   * GET /api/roadmaps
   */
  async listRoadmaps(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.currentUser!.id;
      const roadmaps = await roadmapRepo.listRoadmaps(userId);
      res.json({ success: true, data: roadmaps });
    } catch (error) {
      console.error("[RoadmapController] listRoadmaps error:", error);
      res.status(500).json({ success: false, error: "Failed to list roadmaps." });
    }
  }

  /**
   * GET /api/roadmaps/:id
   */
  async getRoadmap(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.currentUser!.id;
      const { id } = req.params;

      const data = await roadmapRepo.getRoadmap(id, userId);
      if (!data) {
        res.status(404).json({ success: false, error: "Roadmap not found or unauthorized." });
        return;
      }

      const total = data.items.length;
      const completed = data.items.filter((i) => i.status === "COMPLETED").length;
      const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

      res.json({
        success: true,
        data: {
          ...data,
          progress,
        },
      });
    } catch (error) {
      console.error("[RoadmapController] getRoadmap error:", error);
      res.status(500).json({ success: false, error: "Failed to fetch roadmap." });
    }
  }

  /**
   * PATCH /api/roadmaps/:id/items/:itemId
   */
  async updateItemStatus(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.currentUser!.id;
      const { id, itemId } = req.params;
      const { status } = req.body;

      if (!status || !["NOT_STARTED", "IN_PROGRESS", "COMPLETED"].includes(status)) {
        res.status(400).json({ success: false, error: "Status must be NOT_STARTED, IN_PROGRESS, or COMPLETED." });
        return;
      }

      const updated = await roadmapRepo.updateItemStatus(itemId, userId, status);
      if (!updated) {
        res.status(404).json({ success: false, error: "Roadmap item not found or unauthorized." });
        return;
      }

      const data = await roadmapRepo.getRoadmap(id, userId);
      const total = data?.items.length || 0;
      const completed = data?.items.filter((i) => i.status === "COMPLETED").length || 0;
      const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

      res.json({
        success: true,
        data: updated,
        overallProgress: progress,
      });
    } catch (error) {
      console.error("[RoadmapController] updateItemStatus error:", error);
      res.status(500).json({ success: false, error: "Failed to update item status." });
    }
  }

  /**
   * DELETE /api/roadmaps/:id
   */
  async deleteRoadmap(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.currentUser!.id;
      const { id } = req.params;

      const deleted = await roadmapRepo.deleteRoadmap(id, userId);
      if (!deleted) {
        res.status(404).json({ success: false, error: "Roadmap not found." });
        return;
      }

      res.json({ success: true, message: "Roadmap deleted." });
    } catch (error) {
      console.error("[RoadmapController] deleteRoadmap error:", error);
      res.status(500).json({ success: false, error: "Failed to delete roadmap." });
    }
  }
}
