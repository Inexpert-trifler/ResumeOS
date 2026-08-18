import type { Response } from "express";
import { type AuthenticatedRequest } from "../middleware/auth";
import { AIProviderError, AIService } from "../services/ai.service";
import { AiHistoryRepository } from "../repositories/ai-history.repository";
import { ResumeRepository } from "../repositories/resume.repository";

const aiHistoryRepo = new AiHistoryRepository();
const resumeRepo = new ResumeRepository();

/**
 * GET /api/ai/health
 * Safe health/test status check for Groq integration
 */
export async function getAiHealth(_req: AuthenticatedRequest, res: Response): Promise<void> {
  const configured = AIService.isConfigured();
  res.json({
    status: "ok",
    provider: "groq",
    configured,
  });
}

/**
 * POST /api/ai/test
 * Minimal protected test endpoint for Groq AI generation
 */
export async function testGroq(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { prompt } = req.body;
    const userPrompt = typeof prompt === "string" && prompt.trim() ? prompt.trim() : "Say hello from ResumeOS in one sentence.";
    const systemPrompt = "You are ResumeOS AI foundation assistant. Keep responses brief, polite, and single sentence.";

    const text = await AIService.generateText(systemPrompt, userPrompt, 0.2);

    res.json({
      success: true,
      provider: "groq",
      model: AIService.getModel(),
      response: text,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "AI service test failed.";
    const isRateLimit = message.toLowerCase().includes("rate limit");
    const isMissingKey = message.toLowerCase().includes("groq_api_key");
    const providerCode = error instanceof AIProviderError ? error.code : null;

    res.status(isRateLimit ? 429 : 500).json({
      success: false,
      error: {
        code: isRateLimit ? "AI_RATE_LIMIT" : isMissingKey ? "MISSING_API_KEY" : providerCode ?? "AI_SERVICE_ERROR",
        message,
      },
    });
  }
}

/**
 * POST /api/ai/improve
 * AI Resume Improvement endpoint with resume ownership verification & context management
 */
export async function improveContent(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const userId = req.currentUser!.id;
    const {
      section,
      content,
      targetRole,
      targetCompany,
      jobDescription,
      resumeId,
      originalText,
      sectionType,
      targetField,
      userInstruction,
      fieldLabel,
      tone,
      length,
      builderContext,
    } = req.body;

    const textToImprove = typeof originalText === "string" && originalText.trim()
      ? originalText.trim()
      : typeof content === "string" && content.trim()
      ? content.trim()
      : "";

    if (!textToImprove) {
      res.status(400).json({ success: false, error: "Missing or invalid content to improve." });
      return;
    }

    if (textToImprove.length > 5000) {
      res.status(400).json({ success: false, error: "Content is too long. Max 5,000 characters." });
      return;
    }

    let fullResumeContext: Record<string, unknown> | null = null;

    if (resumeId && typeof resumeId === "string") {
      const resumeRecord = await resumeRepo.findOwned(resumeId, userId);
      if (!resumeRecord) {
        res.status(404).json({ success: false, error: "Resume not found or unauthorized access." });
        return;
      }
      fullResumeContext = (resumeRecord.resumeJson as Record<string, unknown>) ?? null;
    }

    const result = await AIService.improveResumeContent({
      section: section || sectionType || "general",
      content: textToImprove,
      targetRole,
      targetCompany,
      jobDescription,
      fullResumeContext,
      userInstruction,
      fieldLabel,
      tone,
      length,
      builderContext,
    });

    if (resumeId && typeof resumeId === "string") {
      try {
        await aiHistoryRepo.recordImprovement({
          resumeId,
          section: section || sectionType || "general",
          originalText: textToImprove,
          improvedText: result.improvedText,
        });
      } catch (err) {
        console.warn("[AI Controller] Failed to record AI history:", err);
      }
    }

    res.json({
      success: true,
      originalText: textToImprove,
      improvedText: result.improvedText,
      explanation: result.explanation,
      reasoning: result.reasoning,
      changes: result.changes,
      warnings: result.warnings,
      confidence: 0.95,
      sectionType: sectionType || section || "summary",
      needsMoreInfo: result.needsMoreInfo,
      followUpQuestions: result.followUpQuestions,
      improvement: result.improvement,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "AI service encountered an issue.";
    const isRateLimit = message.toLowerCase().includes("rate limit");
    const isMissingKey = message.toLowerCase().includes("groq_api_key");
    const providerCode = error instanceof AIProviderError ? error.code : null;

    res.status(isRateLimit ? 429 : 500).json({
      success: false,
      error: {
        code: isRateLimit ? "AI_RATE_LIMIT" : isMissingKey ? "MISSING_API_KEY" : providerCode ?? "AI_SERVICE_ERROR",
        message,
      },
    });
  }
}
