import type { Response } from "express";
import { type AuthenticatedRequest } from "../middleware/auth";
import { AIService } from "../services/ai.service";

export async function analyzeGitHub(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { username } = req.body;
    if (!username || typeof username !== "string" || !username.trim()) {
      res.status(400).json({ success: false, error: "GitHub username is required." });
      return;
    }

    const cleanUsername = username.trim().replace(/^@/, "");
    let profileData: Record<string, unknown> | undefined = undefined;
    let reposList: Array<{ name: string; description?: string; stars?: number; language?: string }> = [];

    // Fetch public GitHub profile safely (no auth token required for basic rate limits)
    try {
      const userRes = await fetch(`https://api.github.com/users/${cleanUsername}`, {
        headers: { "User-Agent": "ResumeOS-App" },
      });

      if (userRes.ok) {
        profileData = (await userRes.json()) as Record<string, unknown>;
      }

      const reposRes = await fetch(`https://api.github.com/users/${cleanUsername}/repos?sort=updated&per_page=10`, {
        headers: { "User-Agent": "ResumeOS-App" },
      });

      if (reposRes.ok) {
        const rawRepos = (await reposRes.json()) as Array<{
          name: string;
          description?: string;
          stargazers_count?: number;
          language?: string;
        }>;

        reposList = rawRepos.map((r) => ({
          name: r.name,
          description: r.description || "",
          stars: r.stargazers_count || 0,
          language: r.language || "Unknown",
        }));
      }
    } catch {
      // Fallback if public GitHub API is unavailable
    }

    const report = await AIService.analyzeGitHubProfile({
      username: cleanUsername,
      profileData,
      repos: reposList,
    });

    res.json({
      success: true,
      data: {
        username: cleanUsername,
        profileData,
        repos: reposList,
        analysis: report,
      },
    });
  } catch (error) {
    console.error("[GitHubController] analyze error:", error);
    res.status(500).json({ success: false, error: "Failed to analyze GitHub profile." });
  }
}
