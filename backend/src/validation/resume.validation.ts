import { z } from "zod";

const jsonObject = z.record(z.string(), z.unknown());

export const createResumeSchema = z.object({
  title: z.string().trim().min(1).max(160).default("Untitled resume"),
  resumeJson: jsonObject,
  selectedTemplate: z.string().trim().min(1).max(80).default("classic"),
  resumeScore: z.number().int().min(0).max(100).nullable().optional(),
  atsScore: z.number().int().min(0).max(100).nullable().optional(),
  isFavorite: z.boolean().optional(),
});

export const updateResumeSchema = createResumeSchema.partial().refine((payload) => Object.keys(payload).length > 0, "At least one field is required");
