import type { Response } from "express";
import { type AuthenticatedRequest } from "../middleware/auth";
import { AIService } from "../services/ai.service";

export async function analyzeLinkedIn(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { headline, about, experience, skills, targetRole } = req.body;

    if (!headline && !about && !experience && !skills) {
      res.status(400).json({ success: false, error: "Please provide at least one LinkedIn section (headline, about, experience, or skills) to analyze." });
      return;
    }

    const report = await AIService.analyzeLinkedInProfile({
      headline,
      about,
      experience,
      skills,
      targetRole: targetRole || "Software Engineer",
    });

    res.json({
      success: true,
      data: report,
    });
  } catch (error) {
    console.error("[LinkedInController] analyze error:", error);
    res.status(500).json({ success: false, error: "Failed to analyze LinkedIn profile." });
  }
}
