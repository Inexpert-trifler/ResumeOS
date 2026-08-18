import { eq, desc, and } from "drizzle-orm";
import { db } from "../db";
import { careerRoadmaps, careerRoadmapItems } from "../db/schema";

export type CareerRoadmapRecord = typeof careerRoadmaps.$inferSelect;
export type CareerRoadmapItemRecord = typeof careerRoadmapItems.$inferSelect;

export class RoadmapRepository {
  async createRoadmap(userId: string, targetRole: string): Promise<CareerRoadmapRecord> {
    const [roadmap] = await db
      .insert(careerRoadmaps)
      .values({
        userId,
        targetRole,
      })
      .returning();
    return roadmap;
  }

  async saveItems(
    roadmapId: string,
    itemsList: Array<{
      title: string;
      description?: string;
      category?: string;
      priority?: string;
      estimatedTime?: string;
      skills?: string[];
      resources?: Array<{ title: string; type?: string; academyReference?: string }>;
    }>
  ): Promise<CareerRoadmapItemRecord[]> {
    const saved = await Promise.all(
      itemsList.map(async (item) => {
        const [created] = await db
          .insert(careerRoadmapItems)
          .values({
            roadmapId,
            title: item.title,
            description: item.description || "",
            category: item.category || "General",
            priority: item.priority || "medium",
            estimatedTime: item.estimatedTime || "1 week",
            skills: item.skills || [],
            resources: item.resources || [],
            status: "NOT_STARTED",
          })
          .returning();
        return created;
      })
    );
    return saved;
  }

  async listRoadmaps(userId: string): Promise<CareerRoadmapRecord[]> {
    return db
      .select()
      .from(careerRoadmaps)
      .where(eq(careerRoadmaps.userId, userId))
      .orderBy(desc(careerRoadmaps.createdAt));
  }

  async getRoadmap(
    id: string,
    userId: string
  ): Promise<{ roadmap: CareerRoadmapRecord; items: CareerRoadmapItemRecord[] } | null> {
    const [roadmap] = await db
      .select()
      .from(careerRoadmaps)
      .where(and(eq(careerRoadmaps.id, id), eq(careerRoadmaps.userId, userId)))
      .limit(1);

    if (!roadmap) return null;

    const items = await db
      .select()
      .from(careerRoadmapItems)
      .where(eq(careerRoadmapItems.roadmapId, id));

    return { roadmap, items };
  }

  async updateItemStatus(
    itemId: string,
    userId: string,
    status: string
  ): Promise<CareerRoadmapItemRecord | null> {
    // Verify item belongs to a roadmap owned by userId
    const [item] = await db
      .select({ item: careerRoadmapItems, roadmap: careerRoadmaps })
      .from(careerRoadmapItems)
      .innerJoin(careerRoadmaps, eq(careerRoadmapItems.roadmapId, careerRoadmaps.id))
      .where(and(eq(careerRoadmapItems.id, itemId), eq(careerRoadmaps.userId, userId)))
      .limit(1);

    if (!item) return null;

    const [updated] = await db
      .update(careerRoadmapItems)
      .set({ status })
      .where(eq(careerRoadmapItems.id, itemId))
      .returning();

    return updated;
  }

  async deleteRoadmap(id: string, userId: string): Promise<boolean> {
    const [deleted] = await db
      .delete(careerRoadmaps)
      .where(and(eq(careerRoadmaps.id, id), eq(careerRoadmaps.userId, userId)))
      .returning();
    return Boolean(deleted);
  }
}
