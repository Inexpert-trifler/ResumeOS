import type { BuilderState, ResumeData, ResumeSection, StudioSettings } from "@/types";

export const RESUME_DRAFT_KEY = "resumeos:sprint-1-draft";

export interface ResumeDraft {
  builder: BuilderState;
  resume: ResumeData;
  sections: ResumeSection[];
  settings: StudioSettings;
  updatedAt: string;
}

export function readResumeDraft(): ResumeDraft | null {
  if (typeof window === "undefined") return null;

  try {
    const value = window.localStorage.getItem(RESUME_DRAFT_KEY);
    return value ? (JSON.parse(value) as ResumeDraft) : null;
  } catch {
    return null;
  }
}

export function saveResumeDraft(draft: ResumeDraft): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(RESUME_DRAFT_KEY, JSON.stringify(draft));
}

const dateLabel = (startDate: string, endDate: string, current = false) => ({
  startDate: startDate || "",
  endDate: current ? "Present" : endDate || "",
});

export function builderToResume(builder: BuilderState): ResumeData {
  const personalInfo = builder.personalInfo;

  return {
    header: {
      name: [personalInfo.firstName, personalInfo.lastName].filter(Boolean).join(" "),
      title: builder.targetRole,
      email: personalInfo.email,
      phone: personalInfo.phone,
      location: personalInfo.location,
      linkedin: personalInfo.linkedin,
      github: personalInfo.github,
      portfolio: personalInfo.portfolio,
    },
    summary: builder.summary,
    experience: builder.experience.map((item) => ({
      id: item.id,
      company: item.company,
      role: item.role,
      ...dateLabel(item.startDate, item.endDate, item.current),
      location: item.location,
      bullets: [...item.responsibilities, ...item.achievements].filter(Boolean),
    })),
    education: builder.education.map((item) => ({
      id: item.id,
      institution: item.institution,
      degree: item.degree,
      field: item.field,
      ...dateLabel(item.startDate, item.endDate, item.current),
      gpa: item.gpa || undefined,
      achievements: item.achievements.filter(Boolean),
    })),
    skills: builder.skills.length
      ? [{ id: "skills", category: "Skills", skills: builder.skills.map((skill) => skill.name).filter(Boolean) }]
      : [],
    projects: builder.projects.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      tech: item.techStack.filter(Boolean),
      github: item.github || undefined,
      demo: item.liveDemo || undefined,
      bullets: [...item.keyFeatures, item.challenges, item.achievements].filter(Boolean),
    })),
    achievements: builder.achievements.map((item) => ({ ...item })),
    certificates: builder.certificates.map((item) => ({
      id: item.id,
      name: item.name,
      issuer: item.issuer,
      date: item.date,
      url: item.url || undefined,
    })),
    leadership: builder.leadership.map((item) => ({
      id: item.id,
      role: item.role,
      org: item.organization,
      duration: [item.startDate, item.endDate].filter(Boolean).join(" – "),
      bullets: item.description ? [item.description] : [],
    })),
    languages: builder.languages.map((item) => ({ id: item.id, name: item.name, level: item.proficiency })),
    interests: builder.interests,
  };
}

export function resumeCompletion(builder: BuilderState): number {
  const checks = [
    Boolean(builder.careerGoal),
    Boolean(builder.targetRole),
    Boolean(builder.experienceLevel),
    Boolean(builder.personalInfo.firstName && builder.personalInfo.email),
    Boolean(builder.summary.trim()),
    builder.skills.length > 0,
    builder.projects.length > 0,
    builder.experience.length > 0,
    builder.education.length > 0,
    builder.achievements.length > 0 || builder.certificates.length > 0,
  ];

  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}
