import type { ResumeData, ResumeSkillGroup } from "@/types";
import type { AiImprovementRequest, AiImprovementSectionType, AiImprovementTargetField } from "./types";

export const STUDIO_AI_SECTION_IDS = [
  "summary",
  "projects",
  "experience",
  "achievements",
  "leadership",
  "skills",
  "certificates",
] as const;

export type StudioAiSectionId = (typeof STUDIO_AI_SECTION_IDS)[number];

export interface StudioAiTarget {
  sectionId: StudioAiSectionId;
  sectionLabel: string;
  originalText: string;
  request: AiImprovementRequest;
  apply: (resume: ResumeData, improvedText: string) => ResumeData;
}

function cloneResume(resume: ResumeData): ResumeData {
  return {
    ...resume,
    header: { ...resume.header },
    experience: resume.experience.map((item) => ({ ...item, bullets: [...item.bullets] })),
    education: resume.education.map((item) => ({ ...item, achievements: [...item.achievements] })),
    skills: resume.skills.map((group) => ({ ...group, skills: [...group.skills] })),
    projects: resume.projects.map((item) => ({ ...item, tech: [...item.tech], bullets: [...item.bullets] })),
    achievements: resume.achievements.map((item) => ({ ...item })),
    certificates: resume.certificates.map((item) => ({ ...item })),
    leadership: resume.leadership.map((item) => ({ ...item, bullets: [...item.bullets] })),
    languages: resume.languages.map((item) => ({ ...item })),
    interests: [...resume.interests],
  };
}

function normalizeText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function splitListText(value: string): string[] {
  return value
    .split(/\n|•|·|,|;|\|/g)
    .map((item) => item.trim())
    .filter(Boolean);
}

function findFirstGroup(resume: ResumeData): ResumeSkillGroup | null {
  return resume.skills[0] ?? null;
}

function buildEntryText(parts: string[]): string {
  return parts.filter(Boolean).join(" — ");
}

function buildSectionTitle(sectionId: StudioAiSectionId): string {
  switch (sectionId) {
    case "summary":
      return "Professional Summary";
    case "projects":
      return "Projects";
    case "experience":
      return "Experience";
    case "achievements":
      return "Achievements";
    case "leadership":
      return "Leadership";
    case "skills":
      return "Skills Description";
    case "certificates":
      return "Certificates Description";
    default:
      return "Resume Section";
  }
}

function updateSummary(resume: ResumeData, improvedText: string): ResumeData {
  return { ...cloneResume(resume), summary: improvedText };
}

function updateProjects(resume: ResumeData, improvedText: string): ResumeData {
  if (!resume.projects.length) return resume;

  const next = cloneResume(resume);
  const project = next.projects[0];
  if (!project) return resume;

  if (project.bullets.length > 0) {
    project.bullets[0] = improvedText;
  } else {
    project.description = improvedText;
  }

  return next;
}

function updateExperience(resume: ResumeData, improvedText: string): ResumeData {
  if (!resume.experience.length) return resume;

  const next = cloneResume(resume);
  const experience = next.experience[0];
  if (!experience) return resume;

  if (experience.bullets.length > 0) {
    experience.bullets[0] = improvedText;
  } else {
    experience.bullets = [improvedText];
  }

  return next;
}

function updateAchievements(resume: ResumeData, improvedText: string): ResumeData {
  if (!resume.achievements.length) return resume;

  const next = cloneResume(resume);
  next.achievements[0] = {
    ...next.achievements[0],
    description: improvedText,
  };
  return next;
}

function updateLeadership(resume: ResumeData, improvedText: string): ResumeData {
  if (!resume.leadership.length) return resume;

  const next = cloneResume(resume);
  const leadership = next.leadership[0];
  if (!leadership) return resume;
  leadership.bullets = leadership.bullets.length > 0 ? [improvedText, ...leadership.bullets.slice(1)] : [improvedText];
  return next;
}

function updateSkills(resume: ResumeData, improvedText: string): ResumeData {
  const next = cloneResume(resume);
  const group = findFirstGroup(next);
  if (!group) return resume;

  const skills = splitListText(improvedText);
  if (!skills.length) return resume;

  group.skills = skills;
  return next;
}

function updateCertificates(resume: ResumeData, improvedText: string): ResumeData {
  if (!resume.certificates.length) return resume;

  const next = cloneResume(resume);
  const certificate = next.certificates[0];
  if (!certificate) return resume;

  const firstLine = normalizeText(improvedText).split(/\r?\n/)[0] ?? improvedText;
  const [name = "", issuer = "", date = ""] = firstLine.split(/\s*[—–|-]\s*/).map((part) => part.trim());
  certificate.name = name || certificate.name;
  certificate.issuer = issuer || certificate.issuer;
  certificate.date = date || certificate.date;
  return next;
}

function createRequest(sectionType: AiImprovementSectionType, targetField: AiImprovementTargetField, originalText: string): AiImprovementRequest {
  return {
    sectionType,
    targetField,
    originalText,
  };
}

export function buildStudioAiTarget(resume: ResumeData, activeSectionId: string | null): StudioAiTarget | null {
  if (!activeSectionId || !STUDIO_AI_SECTION_IDS.includes(activeSectionId as StudioAiSectionId)) {
    return null;
  }

  const sectionId = activeSectionId as StudioAiSectionId;

  switch (sectionId) {
    case "summary": {
      const originalText = normalizeText(resume.summary);
      if (!originalText) return null;
      return {
        sectionId,
        sectionLabel: buildSectionTitle(sectionId),
        originalText,
        request: createRequest("summary", "summary", originalText),
        apply: updateSummary,
      };
    }
    case "projects": {
      const project = resume.projects[0];
      const originalText = project?.bullets[0]?.trim() || normalizeText(project?.description || project?.name || "");
      if (!project || !originalText) return null;
      return {
        sectionId,
        sectionLabel: buildSectionTitle(sectionId),
        originalText,
        request: createRequest("projects", project.bullets.length > 0 ? "project_bullet" : "project_description", originalText),
        apply: updateProjects,
      };
    }
    case "experience": {
      const experience = resume.experience[0];
      const originalText = experience?.bullets[0]?.trim() || normalizeText(`${experience?.role || ""} at ${experience?.company || ""}`);
      if (!experience || !originalText) return null;
      return {
        sectionId,
        sectionLabel: buildSectionTitle(sectionId),
        originalText,
        request: createRequest("experience", "experience_bullet", originalText),
        apply: updateExperience,
      };
    }
    case "achievements": {
      const achievement = resume.achievements[0];
      const originalText = normalizeText(achievement?.description || achievement?.title || "");
      if (!achievement || !originalText) return null;
      return {
        sectionId,
        sectionLabel: buildSectionTitle(sectionId),
        originalText,
        request: createRequest("achievements", "achievement_description", originalText),
        apply: updateAchievements,
      };
    }
    case "leadership": {
      const leadership = resume.leadership[0];
      const originalText = leadership?.bullets[0]?.trim() || normalizeText(`${leadership?.role || ""} at ${leadership?.org || ""}`);
      if (!leadership || !originalText) return null;
      return {
        sectionId,
        sectionLabel: buildSectionTitle(sectionId),
        originalText,
        request: createRequest("leadership", "leadership_description", originalText),
        apply: updateLeadership,
      };
    }
    case "skills": {
      const originalText = resume.skills
        .map((group) => `${group.category}: ${group.skills.join(", ")}`)
        .join("\n")
        .trim();
      if (!originalText) return null;
      return {
        sectionId,
        sectionLabel: buildSectionTitle(sectionId),
        originalText,
        request: createRequest("skills", "skills_list", originalText),
        apply: updateSkills,
      };
    }
    case "certificates": {
      const originalText = resume.certificates
        .map((certificate) => buildEntryText([certificate.name, certificate.issuer, certificate.date]))
        .join("\n")
        .trim();
      if (!originalText) return null;
      return {
        sectionId,
        sectionLabel: buildSectionTitle(sectionId),
        originalText,
        request: createRequest("certificates", "certificate_entry", originalText),
        apply: updateCertificates,
      };
    }
    default:
      return null;
  }
}

export function applyStudioAiImprovement(resume: ResumeData, target: StudioAiTarget, improvedText: string): ResumeData {
  return target.apply(resume, improvedText);
}
