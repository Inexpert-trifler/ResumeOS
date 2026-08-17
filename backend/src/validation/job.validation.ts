import { z } from "zod";

export const createJobSchema = z.object({
  jobTitle: z.string().trim().min(1).max(160),
  company: z.string().trim().min(1).max(160),
  rawDescription: z.string().trim().min(10).max(50000),
  location: z.string().trim().max(200).nullable().optional(),
  employmentType: z
    .enum(["full-time", "part-time", "contract", "internship", "freelance"])
    .nullable()
    .optional(),
  workMode: z.enum(["remote", "hybrid", "on-site"]).nullable().optional(),
  salary: z.string().trim().max(200).nullable().optional(),
  notes: z.string().trim().max(5000).nullable().optional(),
});

export const updateJobSchema = createJobSchema
  .extend({
    status: z
      .enum(["saved", "applied", "interviewing", "offer", "rejected"])
      .optional(),
  })
  .partial()
  .refine(
    (payload) => Object.keys(payload).length > 0,
    "At least one field is required"
  );

export const linkResumeSchema = z.object({
  resumeId: z.string().uuid("resumeId must be a valid UUID"),
});

export type CreateJobInput = z.infer<typeof createJobSchema>;
export type UpdateJobInput = z.infer<typeof updateJobSchema>;
export type LinkResumeInput = z.infer<typeof linkResumeSchema>;
