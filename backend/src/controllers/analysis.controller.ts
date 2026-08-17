import { Request, Response } from "express";
import { getAuth } from "@clerk/express";
import { db } from "../db";
import { resumes, jobDescriptions, resumeAnalysis, resumeJobLinks } from "../db/schema";
import { eq } from "drizzle-orm";

export async function analyzeResume(req: Request, res: Response) {
  try {
    const { resumeId, jobId } = req.body;
    const clerkUserId = getAuth(req).userId;

    if (!clerkUserId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!resumeId || !jobId) {
      return res.status(400).json({ error: "Missing resumeId or jobId" });
    }

    const resume = await db.query.resumes.findFirst({
      where: eq(resumes.id, resumeId)
    });

    const job = await db.query.jobDescriptions.findFirst({
      where: eq(jobDescriptions.id, jobId)
    });

    if (!resume || !job) {
      return res.status(404).json({ error: "Resume or Job not found" });
    }

    const overallScore = 85; 
    const atsScore = 90;
    
    const [analysis] = await db.insert(resumeAnalysis).values({
      resumeId,
      overallScore,
      atsScore,
      strengths: [],
      weaknesses: [],
      recommendations: []
    }).returning();

    await db.insert(resumeJobLinks).values({
      resumeId,
      jobId
    }).onConflictDoNothing();

    res.json(analysis);
  } catch (error) {
    console.error("Analysis Error:", error);
    res.status(500).json({ error: "Failed to run analysis" });
  }
}

export async function generateAiSuggestions(req: Request, res: Response) {
  res.json({ suggestions: [] });
}
