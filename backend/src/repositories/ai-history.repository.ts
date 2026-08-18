import { eq, desc } from "drizzle-orm";
import { db } from "../db";
import { aiHistory } from "../db/schema";

export type AiHistoryRecord = typeof aiHistory.$inferSelect;

export class AiHistoryRepository {
  async recordImprovement(input: {
    resumeId: string;
    section: string;
    originalText: string;
    improvedText: string;
    accepted?: boolean;
  }): Promise<AiHistoryRecord> {
    const [record] = await db
      .insert(aiHistory)
      .values({
        resumeId: input.resumeId,
        section: input.section,
        originalText: input.originalText,
        improvedText: input.improvedText,
        accepted: input.accepted ?? false,
      })
      .returning();
    return record;
  }

  async listHistory(resumeId: string): Promise<AiHistoryRecord[]> {
    return db
      .select()
      .from(aiHistory)
      .where(eq(aiHistory.resumeId, resumeId))
      .orderBy(desc(aiHistory.createdAt));
  }
}
