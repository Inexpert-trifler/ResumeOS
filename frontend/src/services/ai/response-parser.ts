import { z } from "zod";
import {
  AiImprovementResponseSchema,
  type AiImprovementResponse,
  type AiImprovementSectionType,
} from "./types";

function stripCodeFenceMarkers(value: string): string {
  return value.replace(/```(?:json)?/gi, "").replace(/```/g, "").trim();
}

function extractJsonCandidate(value: string): string {
  const trimmed = stripCodeFenceMarkers(value);
  const firstBrace = trimmed.indexOf("{");
  const lastBrace = trimmed.lastIndexOf("}");

  if (firstBrace >= 0 && lastBrace > firstBrace) {
    return trimmed.slice(firstBrace, lastBrace + 1);
  }

  return trimmed;
}

const LooseAiResponseSchema = AiImprovementResponseSchema.extend({
  confidence: z.union([z.number(), z.string()]),
}).passthrough();

function normalizeConfidence(value: number | string): number {
  const numeric = typeof value === "string" ? Number.parseFloat(value) : value;
  if (Number.isNaN(numeric)) return 0;
  return Math.max(0, Math.min(100, numeric <= 1 ? Math.round(numeric * 100) : Math.round(numeric)));
}

export function normalizeAiImprovementResponse(
  payload: unknown,
  sectionType: AiImprovementSectionType
): AiImprovementResponse {
  const parsed = LooseAiResponseSchema.parse(payload);

  return {
    originalText: parsed.originalText ?? "",
    improvedText: parsed.improvedText?.trim() ? parsed.improvedText.trim() : null,
    explanation: parsed.explanation.trim(),
    confidence: normalizeConfidence(parsed.confidence),
    sectionType: parsed.sectionType ?? sectionType,
    needsMoreInfo: parsed.needsMoreInfo ?? false,
    followUpQuestions: parsed.followUpQuestions?.map((question) => question.trim()).filter(Boolean),
  };
}

export function parseAiImprovementResponse(content: string, sectionType: AiImprovementSectionType): AiImprovementResponse {
  const candidate = extractJsonCandidate(content);

  try {
    return normalizeAiImprovementResponse(JSON.parse(candidate), sectionType);
  } catch (error) {
    throw new Error(
      error instanceof Error ? `Unable to parse AI response: ${error.message}` : "Unable to parse AI response."
    );
  }
}

