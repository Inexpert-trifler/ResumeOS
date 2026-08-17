import { and, desc, eq, sql } from "drizzle-orm";
import { db } from "../db";
import { resumes, resumeVersions } from "../db/schema";

export type ResumeRecord = typeof resumes.$inferSelect;
export type ResumePayload = {
  title: string;
  resumeJson: Record<string, unknown>;
  selectedTemplate: string;
  resumeScore?: number | null;
  atsScore?: number | null;
  isFavorite?: boolean;
};

export class ResumeRepository {
  async listByUserId(userId: string): Promise<ResumeRecord[]> {
    return db.select().from(resumes).where(eq(resumes.userId, userId)).orderBy(desc(resumes.updatedAt));
  }

  async findOwned(id: string, userId: string): Promise<ResumeRecord | null> {
    const [resume] = await db.select().from(resumes).where(and(eq(resumes.id, id), eq(resumes.userId, userId))).limit(1);
    return resume ?? null;
  }

  async create(userId: string, payload: ResumePayload): Promise<ResumeRecord> {
    const [resume] = await db.insert(resumes).values({ userId, ...payload }).returning();
    return resume;
  }

  async updateOwned(id: string, userId: string, payload: Partial<ResumePayload>): Promise<ResumeRecord | null> {
    const [resume] = await db
      .update(resumes)
      .set({ ...payload, updatedAt: new Date() })
      .where(and(eq(resumes.id, id), eq(resumes.userId, userId)))
      .returning();
    return resume ?? null;
  }

  async deleteOwned(id: string, userId: string): Promise<boolean> {
    const deleted = await db.delete(resumes).where(and(eq(resumes.id, id), eq(resumes.userId, userId))).returning({ id: resumes.id });
    return deleted.length === 1;
  }

  async createVersion(resumeId: string, resumeJson: Record<string, unknown>): Promise<void> {
    const [{ nextVersion }] = await db
      .select({ nextVersion: sql<number>`coalesce(max(${resumeVersions.versionNumber}), 0) + 1` })
      .from(resumeVersions)
      .where(eq(resumeVersions.resumeId, resumeId));
    await db.insert(resumeVersions).values({ resumeId, versionNumber: nextVersion, resumeJson });
  }
}
