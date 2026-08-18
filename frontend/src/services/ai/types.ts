import { z } from "zod";

export const aiImprovementSectionTypes = [
  "summary",
  "projects",
  "experience",
  "achievements",
  "leadership",
  "skills",
  "certificates",
  "builder",
] as const;

export type AiImprovementSectionType = (typeof aiImprovementSectionTypes)[number];

export const aiImprovementTargetFields = [
  "summary",
  "experience_bullet",
  "project_description",
  "project_bullet",
  "achievement_description",
  "leadership_description",
  "skills_list",
  "certificate_entry",
  "career_goal",
  "target_role",
  "target_company",
] as const;

export type AiImprovementTargetField = (typeof aiImprovementTargetFields)[number];

export interface AiImprovementContext {
  recommendationId?: string;
  recommendationTitle?: string;
  recommendationCategory?: string;
  targetSection?: string;
  targetLabel?: string;
  builderContext?: Record<string, unknown>;
}

export const aiImprovementTones = [
  "professional",
  "confident",
  "concise",
  "enthusiastic",
  "executive",
] as const;

export type AiImprovementTone = (typeof aiImprovementTones)[number];

export const aiImprovementLengths = ["short", "balanced", "detailed"] as const;

export type AiImprovementLength = (typeof aiImprovementLengths)[number];

export interface AiImprovementRequest {
  sectionType: AiImprovementSectionType;
  targetField: AiImprovementTargetField;
  originalText: string;
  context?: AiImprovementContext;
  targetRole?: string;
  targetCompany?: string;
  fieldLabel?: string;
  userInstruction?: string;
  tone?: AiImprovementTone;
  length?: AiImprovementLength;
  builderContext?: Record<string, unknown>;
  resumeContext?: Record<string, unknown>;
}

export interface AiImprovementResponse {
  originalText: string;
  improvedText: string | null;
  explanation: string;
  confidence: number;
  sectionType: AiImprovementSectionType;
  needsMoreInfo?: boolean;
  followUpQuestions?: string[];
  warnings?: string[];
}

export interface AiImprovementTarget {
  sectionType: AiImprovementSectionType;
  targetField: AiImprovementTargetField;
  originalText: string;
  targetLabel: string;
  apply: (builder: import("@/types").BuilderState, improvedText: string) => import("@/types").BuilderState;
}

export const AiImprovementRequestSchema = z.object({
  sectionType: z.enum(aiImprovementSectionTypes),
  targetField: z.enum(aiImprovementTargetFields),
  originalText: z.string().default(""),
  context: z
    .object({
      recommendationId: z.string().optional(),
      recommendationTitle: z.string().optional(),
      recommendationCategory: z.string().optional(),
      targetSection: z.string().optional(),
      targetLabel: z.string().optional(),
      builderContext: z.record(z.string(), z.unknown()).optional(),
    })
    .optional(),
  targetRole: z.string().optional(),
  targetCompany: z.string().optional(),
  fieldLabel: z.string().optional(),
  userInstruction: z.string().optional(),
  tone: z.enum(aiImprovementTones).optional(),
  length: z.enum(aiImprovementLengths).optional(),
  builderContext: z.record(z.string(), z.unknown()).optional(),
  resumeContext: z.record(z.string(), z.unknown()).optional(),
});

export const AiImprovementResponseSchema = z.object({
  originalText: z.string(),
  improvedText: z.string().nullable(),
  explanation: z.string(),
  confidence: z.number(),
  sectionType: z.enum(aiImprovementSectionTypes),
  needsMoreInfo: z.boolean().optional(),
  followUpQuestions: z.array(z.string()).optional(),
  warnings: z.array(z.string()).optional(),
});
