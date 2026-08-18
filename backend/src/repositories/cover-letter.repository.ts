import { eq, desc, and } from "drizzle-orm";
import { db } from "../db";
import { coverLetters } from "../db/schema";

export type CoverLetterRecord = typeof coverLetters.$inferSelect;

export class CoverLetterRepository {
  async createCoverLetter(input: {
    userId: string;
    resumeId: string;
    jobId?: string;
    title: string;
    content: string;
    tone: string;
  }): Promise<CoverLetterRecord> {
    // If jobId is not provided, find or fallback
    let jobId = input.jobId;
    if (!jobId) {
      // Find first job of user or create default
      const userJobs = await db.query.jobDescriptions.findMany({
        where: (jobs, { eq }) => eq(jobs.userId, input.userId),
        limit: 1,
      });

      if (userJobs.length > 0) {
        jobId = userJobs[0].id;
      } else {
        const [dummyJob] = await db
          .insert(db._.fullSchema.jobDescriptions)
          .values({
            userId: input.userId,
            jobTitle: input.title,
            company: "Target Company",
            rawDescription: "Target job description for cover letter generation.",
          })
          .returning();
        jobId = dummyJob.id;
      }
    }

    const [record] = await db
      .insert(coverLetters)
      .values({
        userId: input.userId,
        resumeId: input.resumeId,
        jobId: jobId!,
        title: input.title,
        content: input.content,
        tone: input.tone,
      })
      .returning();

    return record;
  }

  async listCoverLetters(userId: string): Promise<CoverLetterRecord[]> {
    return db
      .select()
      .from(coverLetters)
      .where(eq(coverLetters.userId, userId))
      .orderBy(desc(coverLetters.updatedAt));
  }

  async getCoverLetter(id: string, userId: string): Promise<CoverLetterRecord | null> {
    const [record] = await db
      .select()
      .from(coverLetters)
      .where(and(eq(coverLetters.id, id), eq(coverLetters.userId, userId)))
      .limit(1);
    return record ?? null;
  }

  async updateCoverLetter(id: string, userId: string, content: string): Promise<CoverLetterRecord | null> {
    const [updated] = await db
      .update(coverLetters)
      .set({ content, updatedAt: new Date() })
      .where(and(eq(coverLetters.id, id), eq(coverLetters.userId, userId)))
      .returning();
    return updated ?? null;
  }

  async deleteCoverLetter(id: string, userId: string): Promise<boolean> {
    const [deleted] = await db
      .delete(coverLetters)
      .where(and(eq(coverLetters.id, id), eq(coverLetters.userId, userId)))
      .returning();
    return Boolean(deleted);
  }
}
