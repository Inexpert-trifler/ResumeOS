import { eq } from "drizzle-orm";
import { db } from "../db";
import { users, type users as UsersTable } from "../db/schema";

export type AppUser = typeof UsersTable.$inferSelect;

export class UserRepository {
  async upsert(input: { clerkUserId: string; email: string; name: string | null; avatarUrl: string | null }): Promise<AppUser> {
    const [user] = await db
      .insert(users)
      .values(input)
      .onConflictDoUpdate({
        target: users.clerkUserId,
        set: { email: input.email, name: input.name, avatarUrl: input.avatarUrl, updatedAt: new Date() },
      })
      .returning();
    return user;
  }

  async findByClerkUserId(clerkUserId: string): Promise<AppUser | null> {
    const [user] = await db.select().from(users).where(eq(users.clerkUserId, clerkUserId)).limit(1);
    return user ?? null;
  }
}
