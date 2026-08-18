import { eq, desc, asc, and } from "drizzle-orm";
import { db } from "../db";
import { coachConversations, coachMessages } from "../db/schema";

export type CoachConversation = typeof coachConversations.$inferSelect;
export type CoachMessage = typeof coachMessages.$inferSelect;

export class CoachRepository {
  /**
   * Create a new coach conversation for a user
   */
  async createConversation(userId: string, title = "Resume Coaching"): Promise<CoachConversation> {
    const [conversation] = await db
      .insert(coachConversations)
      .values({
        userId,
        title,
      })
      .returning();
    return conversation;
  }

  /**
   * List all conversations owned by a user
   */
  async listConversations(userId: string): Promise<CoachConversation[]> {
    return db
      .select()
      .from(coachConversations)
      .where(eq(coachConversations.userId, userId))
      .orderBy(desc(coachConversations.updatedAt));
  }

  /**
   * Get a conversation by ID, verifying user ownership
   */
  async getConversation(id: string, userId: string): Promise<CoachConversation | null> {
    const [conversation] = await db
      .select()
      .from(coachConversations)
      .where(and(eq(coachConversations.id, id), eq(coachConversations.userId, userId)))
      .limit(1);
    return conversation ?? null;
  }

  /**
   * Get all messages for a specific conversation
   */
  async getMessages(conversationId: string): Promise<CoachMessage[]> {
    return db
      .select()
      .from(coachMessages)
      .where(eq(coachMessages.conversationId, conversationId))
      .orderBy(asc(coachMessages.createdAt));
  }

  /**
   * Add a message to a conversation and update conversation's updatedAt timestamp
   */
  async addMessage(conversationId: string, role: "user" | "assistant", content: string): Promise<CoachMessage> {
    const [message] = await db
      .insert(coachMessages)
      .values({
        conversationId,
        role,
        content,
      })
      .returning();

    await db
      .update(coachConversations)
      .set({ updatedAt: new Date() })
      .where(eq(coachConversations.id, conversationId));

    return message;
  }

  /**
   * Delete a conversation owned by a user
   */
  async deleteConversation(id: string, userId: string): Promise<boolean> {
    const [deleted] = await db
      .delete(coachConversations)
      .where(and(eq(coachConversations.id, id), eq(coachConversations.userId, userId)))
      .returning();
    return Boolean(deleted);
  }
}
