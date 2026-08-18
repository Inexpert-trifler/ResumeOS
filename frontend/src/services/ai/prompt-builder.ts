import type { AiImprovementRequest } from "./types";

const MODEL_INSTRUCTIONS = [
  "You are improving an existing resume section.",
  "Rewrite only the content the user already provided.",
  "Do not invent companies, job titles, dates, degrees, certifications, metrics, technologies, or achievements.",
  "Preserve the truth of the original text.",
  "If the section does not include enough detail to improve safely, set needsMoreInfo to true and ask concise follow-up questions instead of fabricating content.",
  "Return JSON only with these keys: originalText, improvedText, explanation, confidence, sectionType, needsMoreInfo, followUpQuestions.",
  "Keep improvedText concise, ATS-friendly, and professional.",
  "confidence must be a whole number from 0 to 100.",
].join(" ");

function sectionGuidance(request: AiImprovementRequest): string {
  switch (request.targetField) {
    case "summary":
      return "Improve the summary by sharpening the positioning, clarity, and role alignment without adding facts.";
    case "experience_bullet":
      return "Improve the work-experience bullet by strengthening the verb choice, clarity, and outcome language while preserving the same facts.";
    case "project_description":
      return "Improve the project description by making it more concise and outcome-oriented without adding new facts.";
    case "project_bullet":
      return "Improve the project bullet by making it more measurable and recruiter-friendly without inventing metrics.";
    case "achievement_description":
      return "Improve the achievement description by making it sharper and more specific without adding new awards or metrics.";
    case "leadership_description":
      return "Improve the leadership or volunteering description by highlighting impact and ownership without adding new details.";
    case "skills_list":
      return "Improve the skills list by normalizing names, removing duplicates, and ordering the same skills more strategically without inventing new skills.";
    case "certificate_entry":
      return "Improve the certificate entry by making the formatting cleaner and more readable without inventing credentials or issuers.";
    case "career_goal":
      return "Refine the career goal into a concise, recruiter-friendly statement without changing the user's intent.";
    case "target_role":
      return "Refine the target role wording so it is clear, specific, and aligned to the user's actual goals.";
    case "target_company":
      return "Refine the target company wording so it is concise and specific without inventing preferences or relationships.";
    default:
      return "Improve the provided text safely and professionally.";
  }
}

export function buildAiImprovementMessages(request: AiImprovementRequest) {
  const userPayload = {
    sectionType: request.sectionType,
    targetField: request.targetField,
    originalText: request.originalText,
    context: request.context ?? {},
    targetRole: request.targetRole ?? "",
    targetCompany: request.targetCompany ?? "",
    fieldLabel: request.fieldLabel ?? "",
    userInstruction: request.userInstruction ?? "",
    tone: request.tone ?? "professional",
    length: request.length ?? "balanced",
    builderContext: request.builderContext ?? request.context?.builderContext ?? {},
    resumeContext: request.resumeContext ?? {},
    instructions: sectionGuidance(request),
  };

  return [
    {
      role: "system" as const,
      content: MODEL_INSTRUCTIONS,
    },
    {
      role: "user" as const,
      content: JSON.stringify(userPayload, null, 2),
    },
  ];
}
