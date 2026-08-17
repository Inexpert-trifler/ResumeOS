import { and, desc, eq } from "drizzle-orm";
import { db } from "../db";
import { jobDescriptions, jobKeywords, jobAnalysis, resumeJobLinks } from "../db/schema";
import type { ProcessedKeyword } from "../services/job-keyword.service";
import type { JobInsights } from "../services/job-analysis.service";
import type { ParsedJobData } from "../services/job-parser.service";

export type JobRecord = typeof jobDescriptions.$inferSelect;

export interface JobCreatePayload {
  jobTitle: string;
  company: string;
  rawDescription: string;
  location?: string | null;
  employmentType?: string | null;
  workMode?: string | null;
  salary?: string | null;
  notes?: string | null;
}

export interface JobUpdatePayload {
  jobTitle?: string;
  company?: string;
  rawDescription?: string;
  location?: string | null;
  employmentType?: string | null;
  workMode?: string | null;
  salary?: string | null;
  notes?: string | null;
  status?: string;
  parsedData?: ParsedJobData | null;
  isParsed?: boolean;
}

export class JobRepository {
  // ─── Job CRUD ──────────────────────────────────────────────────────────────

  async listByUserId(userId: string): Promise<JobRecord[]> {
    return db
      .select()
      .from(jobDescriptions)
      .where(eq(jobDescriptions.userId, userId))
      .orderBy(desc(jobDescriptions.updatedAt));
  }

  async findOwned(id: string, userId: string): Promise<JobRecord | null> {
    const [job] = await db
      .select()
      .from(jobDescriptions)
      .where(and(eq(jobDescriptions.id, id), eq(jobDescriptions.userId, userId)))
      .limit(1);
    return job ?? null;
  }

  async create(userId: string, payload: JobCreatePayload): Promise<JobRecord> {
    const [job] = await db
      .insert(jobDescriptions)
      .values({ userId, ...payload })
      .returning();
    return job;
  }

  async updateOwned(
    id: string,
    userId: string,
    payload: JobUpdatePayload,
  ): Promise<JobRecord | null> {
    const [job] = await db
      .update(jobDescriptions)
      .set({ ...payload, updatedAt: new Date() })
      .where(and(eq(jobDescriptions.id, id), eq(jobDescriptions.userId, userId)))
      .returning();
    return job ?? null;
  }

  async deleteOwned(id: string, userId: string): Promise<boolean> {
    const deleted = await db
      .delete(jobDescriptions)
      .where(and(eq(jobDescriptions.id, id), eq(jobDescriptions.userId, userId)))
      .returning({ id: jobDescriptions.id });
    return deleted.length === 1;
  }

  /** Internal server-side update — no ownership check (called by parser service) */
  async saveParsedData(jobId: string, parsedData: ParsedJobData): Promise<void> {
    await db
      .update(jobDescriptions)
      .set({ parsedData: parsedData as unknown as Record<string, unknown>, isParsed: true, updatedAt: new Date() })
      .where(eq(jobDescriptions.id, jobId));
  }

  // ─── Keywords ──────────────────────────────────────────────────────────────

  async saveKeywords(jobId: string, keywords: ProcessedKeyword[]): Promise<void> {
    // Delete existing keywords for this job
    await db.delete(jobKeywords).where(eq(jobKeywords.jobId, jobId));

    if (keywords.length === 0) return;

    // Insert new keywords in batches of 50
    for (let i = 0; i < keywords.length; i += 50) {
      const batch = keywords.slice(i, i + 50);
      await db.insert(jobKeywords).values(
        batch.map((kw) => ({
          jobId,
          keyword: kw.keyword,
          category: kw.category,
          keywordType: kw.keywordType,
          frequency: kw.frequency,
          weight: kw.weight,
        }))
      );
    }
  }

  async getKeywordsByJobId(jobId: string) {
    return db
      .select()
      .from(jobKeywords)
      .where(eq(jobKeywords.jobId, jobId))
      .orderBy(desc(jobKeywords.weight));
  }

  // ─── Analysis ──────────────────────────────────────────────────────────────

  async saveAnalysis(jobId: string, analysis: JobInsights): Promise<void> {
    const { insights, seniorityLevel, ...metrics } = analysis;

    // Upsert — delete and re-insert
    await db.delete(jobAnalysis).where(eq(jobAnalysis.jobId, jobId));
    await db.insert(jobAnalysis).values({
      jobId,
      ...metrics,
      insights: insights as unknown as Record<string, unknown>,
      seniorityLevel,
    });
  }

  async getAnalysisByJobId(jobId: string) {
    const [result] = await db
      .select()
      .from(jobAnalysis)
      .where(eq(jobAnalysis.jobId, jobId))
      .limit(1);
    return result ?? null;
  }

  // ─── Resume ↔ Job Links ────────────────────────────────────────────────────

  async linkResume(jobId: string, resumeId: string): Promise<void> {
    await db
      .insert(resumeJobLinks)
      .values({ jobId, resumeId })
      .onConflictDoNothing();
  }

  async unlinkResume(jobId: string, resumeId: string): Promise<void> {
    await db
      .delete(resumeJobLinks)
      .where(
        and(
          eq(resumeJobLinks.jobId, jobId),
          eq(resumeJobLinks.resumeId, resumeId),
        )
      );
  }

  async getLinkedResumes(jobId: string) {
    return db
      .select({ resumeId: resumeJobLinks.resumeId, createdAt: resumeJobLinks.createdAt })
      .from(resumeJobLinks)
      .where(eq(resumeJobLinks.jobId, jobId));
  }

  async getLinkedJobs(resumeId: string) {
    return db
      .select({ jobId: resumeJobLinks.jobId, createdAt: resumeJobLinks.createdAt })
      .from(resumeJobLinks)
      .where(eq(resumeJobLinks.resumeId, resumeId));
  }
}
