import type { Response } from "express";
import { type AuthenticatedRequest } from "../middleware/auth";
import { SettingsRepository } from "../repositories/settings.repository";

const repo = new SettingsRepository();

export class SettingsController {
  /**
   * GET /api/settings
   */
  async getSettings(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const currentUser = req.currentUser!;
      const email = currentUser.email || "user@example.com";
      const name = currentUser.name || "Candidate";
      const avatarUrl = currentUser.avatarUrl || "";

      const synced = await repo.syncUser({
        clerkUserId: currentUser.clerkUserId,
        email,
        name,
        avatarUrl,
      });

      res.json({
        success: true,
        data: {
          user: synced.user,
          settings: synced.settings,
        },
      });
    } catch (error) {
      console.error("[SettingsController] getSettings error:", error);
      res.status(500).json({ success: false, error: "Failed to fetch settings." });
    }
  }

  /**
   * PATCH /api/settings
   */
  async updateSettings(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const currentUser = req.currentUser!;
      const { theme, defaultTemplate, defaultFont, accentColor } = req.body;

      const synced = await repo.syncUser({
        clerkUserId: currentUser.clerkUserId,
        email: currentUser.email,
        name: currentUser.name || "Candidate",
      });

      const updated = await repo.updateSettings(synced.user.id, {
        theme,
        defaultTemplate,
        defaultFont,
        accentColor,
      });

      res.json({ success: true, data: updated });
    } catch (error) {
      console.error("[SettingsController] updateSettings error:", error);
      res.status(500).json({ success: false, error: "Failed to update settings." });
    }
  }
}
