import type { Response } from "express";
import { type AuthenticatedRequest } from "../middleware/auth";
import { db } from "../db";
import { resumes, jobDescriptions, coverLetters, interviewSessions, careerRoadmaps, resumeAnalysis } from "../db/schema";
import { eq, desc } from "drizzle-orm";

export async function getDashboardStats(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const userId = req.currentUser!.id;

    // 1. Fetch count of user resumes
    const userResumes = await db
      .select()
      .from(resumes)
      .where(eq(resumes.userId, userId))
      .orderBy(desc(resumes.updatedAt));

    // 2. Fetch count of jobs tracked
    const userJobs = await db
      .select()
      .from(jobDescriptions)
      .where(eq(jobDescriptions.userId, userId))
      .orderBy(desc(jobDescriptions.updatedAt));

    // 3. Fetch count of cover letters
    const userCoverLetters = await db
      .select()
      .from(coverLetters)
      .where(eq(coverLetters.userId, userId));

    // 4. Fetch count of interview sessions
    const userInterviews = await db
      .select()
      .from(interviewSessions)
      .where(eq(interviewSessions.userId, userId));

    // 5. Fetch count of career roadmaps
    const userRoadmaps = await db
      .select()
      .from(careerRoadmaps)
      .where(eq(careerRoadmaps.userId, userId));

    // 6. Calculate Average ATS Score
    let avgAtsScore = 0;
    if (userResumes.length > 0) {
      const analyses = await db
        .select()
        .from(resumeAnalysis)
        .where(eq(resumeAnalysis.resumeId, userResumes[0].id));

      if (analyses.length > 0 && typeof analyses[0].atsScore === "number") {
        avgAtsScore = analyses[0].atsScore;
      } else {
        avgAtsScore = userResumes[0].atsScore || 75;
      }
    }

    res.json({
      success: true,
      stats: {
        totalResumes: userResumes.length,
        totalJobsTracked: userJobs.length,
        totalCoverLetters: userCoverLetters.length,
        totalInterviews: userInterviews.length,
        totalRoadmaps: userRoadmaps.length,
        avgAtsScore,
      },
      recentResumes: userResumes.slice(0, 3).map((r) => ({
        id: r.id,
        title: r.title,
        updatedAt: r.updatedAt,
        template: r.selectedTemplate,
      })),
      recentJobs: userJobs.slice(0, 3).map((j) => ({
        id: j.id,
        jobTitle: j.jobTitle,
        company: j.company,
        status: j.status,
      })),
    });
  } catch (error) {
    console.error("[DashboardController] getDashboardStats error:", error);
    res.status(500).json({ success: false, error: "Failed to fetch dashboard statistics." });
  }
}
