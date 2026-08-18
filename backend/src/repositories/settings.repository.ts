import { eq } from "drizzle-orm";
import { db } from "../db";
import { users, userSettings } from "../db/schema";

export type UserRecord = typeof users.$inferSelect;
export type UserSettingsRecord = typeof userSettings.$inferSelect;

export class SettingsRepository {
  /**
   * Auto-synchronize Clerk user in database `users` and `user_settings`
   */
  async syncUser(input: {
    clerkUserId: string;
    email: string;
    name?: string;
    avatarUrl?: string;
  }): Promise<{ user: UserRecord; settings: UserSettingsRecord }> {
    let [foundUser] = await db
      .select()
      .from(users)
      .where(eq(users.clerkUserId, input.clerkUserId))
      .limit(1);

    if (!foundUser) {
      [foundUser] = await db
        .insert(users)
        .values({
          clerkUserId: input.clerkUserId,
          email: input.email,
          name: input.name || "User",
          avatarUrl: input.avatarUrl || "",
        })
        .returning();
    }

    let [foundSettings] = await db
      .select()
      .from(userSettings)
      .where(eq(userSettings.userId, foundUser.id))
      .limit(1);

    if (!foundSettings) {
      [foundSettings] = await db
        .insert(userSettings)
        .values({
          userId: foundUser.id,
          theme: "system",
          defaultTemplate: "classic",
          defaultFont: "Inter",
          accentColor: "#6366f1",
        })
        .returning();
    }

    return { user: foundUser, settings: foundSettings };
  }

  async updateSettings(
    userId: string,
    input: {
      theme?: string;
      defaultTemplate?: string;
      defaultFont?: string;
      accentColor?: string;
    }
  ): Promise<UserSettingsRecord> {
    const [existing] = await db
      .select()
      .from(userSettings)
      .where(eq(userSettings.userId, userId))
      .limit(1);

    if (!existing) {
      const [created] = await db
        .insert(userSettings)
        .values({
          userId,
          theme: input.theme || "system",
          defaultTemplate: input.defaultTemplate || "classic",
          defaultFont: input.defaultFont || "Inter",
          accentColor: input.accentColor || "#6366f1",
        })
        .returning();
      return created;
    }

    const [updated] = await db
      .update(userSettings)
      .set(input)
      .where(eq(userSettings.userId, userId))
      .returning();

    return updated;
  }
}
