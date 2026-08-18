import type { Response } from "express";
import { type AuthenticatedRequest } from "../middleware/auth";
import { db } from "../db";
import { resumes, jobDescriptions, resumeAnalysis, resumeJobLinks } from "../db/schema";
import { eq, and } from "drizzle-orm";
import { JobAnalysisService, type ResumeData } from "../services/job-analysis.service";
import { ResumeHealthService } from "../services/resume-health.service";
import { AIService } from "../services/ai.service";

const analysisService = new JobAnalysisService();
const resumeHealthService = new ResumeHealthService();

export async function analyzeResume(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const userId = req.currentUser!.id;
    const { resumeId, jobId, jobDescription, targetRole } = req.body;

    let targetResume: Record<string, unknown> | null = null;
    let targetResumeId = resumeId;

    // 1. Fetch resume (by resumeId or user's latest active resume)
    if (resumeId) {
      const [found] = await db
        .select()
        .from(resumes)
        .where(and(eq(resumes.id, resumeId), eq(resumes.userId, userId)))
        .limit(1);

      if (!found) {
        res.status(404).json({ success: false, error: "Resume not found or unauthorized." });
        return;
      }
      targetResume = found.resumeJson as Record<string, unknown>;
    } else {
      const [latest] = await db
        .select()
        .from(resumes)
        .where(eq(resumes.userId, userId))
        .limit(1);

      if (latest) {
        targetResume = latest.resumeJson as Record<string, unknown>;
        targetResumeId = latest.id;
      }
    }

    if (!targetResume) {
      res.status(400).json({ success: false, error: "No active resume found to analyze. Please create or save a resume first." });
      return;
    }

    // 2. Fetch or parse Job Description
    let jobText = jobDescription || "";
    let jobTitle = targetRole || "";
    let company = "";

    if (jobId) {
      const [foundJob] = await db
        .select()
        .from(jobDescriptions)
        .where(and(eq(jobDescriptions.id, jobId), eq(jobDescriptions.userId, userId)))
        .limit(1);

      if (foundJob) {
        jobText = jobText || foundJob.rawDescription;
        jobTitle = jobTitle || foundJob.jobTitle;
        company = foundJob.company;
      }
    }

    if (!jobText || !jobText.trim()) {
      res.status(400).json({ success: false, error: "A job description is required for ATS job-match analysis." });
      return;
    }

    // One canonical, deterministic report. Job Match and Resume ATS Health are
    // distinct scores so UI consumers cannot present one as the other.
    const report = analysisService.compareResumeToJob(targetResume as ResumeData, jobText, { jobTitle, company });
    const resumeHealth = resumeHealthService.analyze(targetResume as ResumeData);

    // 4. Optionally generate AI summary explanation
    let aiExplanation = { summary: "", actionableAdvice: report.recommendations };
    try {
      aiExplanation = await AIService.generateAtsExplanation({
        atsScore: report.atsScore,
        breakdown: report.breakdown as unknown as Record<string, number>,
        matchedSkills: report.matchedSkills,
        missingSkills: report.missingSkills,
        targetRole: jobTitle || report.matchedSkills[0],
      });
    } catch {
      // Fallback if AI call fails
    }

    // 5. Persist analysis to PostgreSQL if resumeId exists
    let savedAnalysisId: string | null = null;
    if (targetResumeId) {
      try {
        const [saved] = await db
          .insert(resumeAnalysis)
          .values({
            resumeId: targetResumeId,
            overallScore: report.overallScore,
            atsScore: report.atsScore,
            strengths: report.strengths,
            weaknesses: report.weaknesses,
            recommendations: aiExplanation.actionableAdvice.length > 0 ? aiExplanation.actionableAdvice : report.recommendations,
          })
          .returning();
        savedAnalysisId = saved.id;

        if (jobId) {
          await db
            .insert(resumeJobLinks)
            .values({ resumeId: targetResumeId, jobId })
            .onConflictDoNothing();
        }
      } catch (dbErr) {
        console.warn("[AnalysisController] DB persistence warning:", dbErr);
      }
    }

    res.json({
      success: true,
      analysisId: savedAnalysisId,
      overallScore: report.overallScore,
      atsScore: report.atsScore,
      breakdown: report.breakdown,
      matchedSkills: report.matchedSkills,
      missingSkills: report.missingSkills,
      matchedKeywords: report.matchedKeywords,
      missingKeywords: report.missingKeywords,
      recommendations: aiExplanation.actionableAdvice.length > 0 ? aiExplanation.actionableAdvice : report.recommendations,
      strengths: report.strengths,
      weaknesses: report.weaknesses,
      jobTitleMatch: report.jobTitleMatch,
      seniorityMatch: report.seniorityMatch,
      aiSummary: aiExplanation.summary,
      resumeHealth,
    });
  } catch (error) {
    console.error("[AnalysisController] Error running ATS analysis:", error);
    res.status(500).json({ success: false, error: "Failed to perform ATS resume analysis." });
  }
}

export async function generateAiSuggestions(_req: AuthenticatedRequest, res: Response) {
  try {
    const req = _req;
    const userId = req.currentUser!.id;
    const { id } = req.params;

    const [analysisRow] = await db
      .select({
        id: resumeAnalysis.id,
        recommendations: resumeAnalysis.recommendations,
        strengths: resumeAnalysis.strengths,
        weaknesses: resumeAnalysis.weaknesses,
      })
      .from(resumeAnalysis)
      .innerJoin(resumes, eq(resumeAnalysis.resumeId, resumes.id))
      .where(and(eq(resumeAnalysis.id, id), eq(resumes.userId, userId)))
      .limit(1);

    if (!analysisRow) {
      res.status(404).json({ success: false, error: "Analysis not found." });
      return;
    }

    const recommendations = Array.isArray(analysisRow.recommendations) ? analysisRow.recommendations : [];
    const strengths = Array.isArray(analysisRow.strengths) ? analysisRow.strengths : [];
    const weaknesses = Array.isArray(analysisRow.weaknesses) ? analysisRow.weaknesses : [];

    const suggestions = [
      ...recommendations.slice(0, 5),
      ...weaknesses.slice(0, 2).map((item) => `Address this weakness: ${item}`),
      ...strengths.slice(0, 2).map((item) => `Lean into this strength: ${item}`),
    ].slice(0, 8);

    res.json({
      success: true,
      suggestions,
    });
  } catch (error) {
    console.error("[AnalysisController] generateAiSuggestions error:", error);
    res.status(500).json({ success: false, error: "Failed to generate AI suggestions." });
  }
}
