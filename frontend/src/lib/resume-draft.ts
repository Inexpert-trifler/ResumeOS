import { useEffect, useState } from "react";
import { INITIAL_STATE, type BuilderState, type ResumeData, type ResumeSection, type StudioSettings } from "@/types";
import { DEFAULT_SECTIONS, DEFAULT_SETTINGS } from "@/data/mock-resume";

export const RESUME_DRAFT_KEY = "resumeos:sprint-1-draft";
const RESUME_DRAFT_EVENT = "resumeos:sprint-1-draft:updated";
let cachedDraftRaw: string | null = null;
let cachedDraftSnapshot: ResumeDraft | null = null;

export interface ResumeDraft {
  builder: BuilderState;
  resume: ResumeData;
  sections: ResumeSection[];
  settings: StudioSettings;
  updatedAt: string;
}

function toDate(value: unknown): Date | null {
  if (!value) return null;
  const candidate = value instanceof Date ? value : new Date(value as string);
  return Number.isNaN(candidate.getTime()) ? null : candidate;
}

function cloneArray<T>(value: unknown, fallback: T[]): T[] {
  return Array.isArray(value) ? [...(value as T[])] : [...fallback];
}

function mergeBuilderState(builder?: Partial<BuilderState> | null): BuilderState {
  const source = builder ?? {};
  return {
    ...INITIAL_STATE,
    ...source,
    personalInfo: {
      ...INITIAL_STATE.personalInfo,
      ...(source.personalInfo ?? {}),
    },
    skills: cloneArray(source.skills, INITIAL_STATE.skills),
    projects: cloneArray(source.projects, INITIAL_STATE.projects),
    experience: cloneArray(source.experience, INITIAL_STATE.experience),
    education: cloneArray(source.education, INITIAL_STATE.education),
    achievements: cloneArray(source.achievements, INITIAL_STATE.achievements),
    certificates: cloneArray(source.certificates, INITIAL_STATE.certificates),
    leadership: cloneArray(source.leadership, INITIAL_STATE.leadership),
    languages: cloneArray(source.languages, INITIAL_STATE.languages),
    interests: cloneArray(source.interests, INITIAL_STATE.interests),
    lastSaved: toDate(source.lastSaved),
  };
}

export function readResumeDraft(): ResumeDraft | null {
  if (typeof window === "undefined") return null;

  try {
    const value = window.localStorage.getItem(RESUME_DRAFT_KEY);
    if (value === cachedDraftRaw) {
      return cachedDraftSnapshot;
    }

    cachedDraftRaw = value;
    cachedDraftSnapshot = value ? (JSON.parse(value) as ResumeDraft) : null;
    return cachedDraftSnapshot;
  } catch {
    return null;
  }
}

export function saveResumeDraft(draft: ResumeDraft): void {
  if (typeof window === "undefined") return;
  const serialized = JSON.stringify(draft);
  cachedDraftRaw = serialized;
  cachedDraftSnapshot = draft;
  window.localStorage.setItem(RESUME_DRAFT_KEY, serialized);
  window.dispatchEvent(new Event(RESUME_DRAFT_EVENT));
}

function subscribeToResumeDraftChanges(callback: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleStorage = (event: StorageEvent | Event) => {
    if (event instanceof StorageEvent) {
      if (event.storageArea !== window.localStorage) return;
      if (event.key && event.key !== RESUME_DRAFT_KEY) return;
    }
    callback();
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener(RESUME_DRAFT_EVENT, handleStorage);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(RESUME_DRAFT_EVENT, handleStorage);
  };
}

export function useResumeDraftSnapshot(): ResumeDraft | null {
  const [snapshot, setSnapshot] = useState<ResumeDraft | null>(null);

  useEffect(() => {
    const updateSnapshot = () => {
      setSnapshot(readResumeDraft());
    };

    updateSnapshot();
    return subscribeToResumeDraftChanges(updateSnapshot);
  }, []);

  return snapshot;
}

export function hydrateBuilderState(builder?: Partial<BuilderState> | null): BuilderState {
  return mergeBuilderState(builder);
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

function splitName(name: string): { firstName: string; lastName: string } {
  const trimmed = name.trim();
  if (!trimmed) return { firstName: "", lastName: "" };

  const parts = trimmed.split(/\s+/);
  const firstName = parts.shift() ?? "";
  return {
    firstName,
    lastName: parts.join(" "),
  };
}

export function resumeToBuilder(resume: ResumeData, existing?: Partial<BuilderState> | null): BuilderState {
  const base = mergeBuilderState(existing);
  const existingProjects = new Map(base.projects.map((project) => [project.id, project]));
  const existingExperience = new Map(base.experience.map((experience) => [experience.id, experience]));
  const existingAchievements = new Map(base.achievements.map((achievement) => [achievement.id, achievement]));
  const existingCertificates = new Map(base.certificates.map((certificate) => [certificate.id, certificate]));
  const existingLeadership = new Map(base.leadership.map((leadership) => [leadership.id, leadership]));
  const existingLanguages = new Map(base.languages.map((language) => [language.id, language]));

  return {
    ...base,
    targetRole: resume.header.title || base.targetRole,
    personalInfo: {
      ...base.personalInfo,
      ...splitName(resume.header.name),
      email: resume.header.email || "",
      phone: resume.header.phone || "",
      location: resume.header.location || "",
      linkedin: resume.header.linkedin || "",
      github: resume.header.github || "",
      portfolio: resume.header.portfolio || "",
    },
    summary: resume.summary || "",
    skills: resume.skills.flatMap((group) =>
      group.skills.map((skill) => ({
        id: `${group.id}:${skill}`,
        name: skill,
        level: undefined,
        category: group.category,
      }))
    ),
    projects: resume.projects.map((project, index) => {
      const fallback = existingProjects.get(project.id) ?? base.projects[index];
      return {
        id: project.id,
        name: project.name,
        description: project.description,
        techStack: [...project.tech],
        github: project.github ?? fallback?.github ?? "",
        liveDemo: project.demo ?? fallback?.liveDemo ?? "",
        role: fallback?.role ?? "",
        duration: fallback?.duration ?? "",
        keyFeatures: [...project.bullets],
        challenges: fallback?.challenges ?? "",
        achievements: fallback?.achievements ?? "",
      };
    }),
    experience: resume.experience.map((experience, index) => {
      const fallback = existingExperience.get(experience.id) ?? base.experience[index];
      const isPresent = experience.endDate === "Present";
      return {
        id: experience.id,
        company: experience.company,
        role: experience.role,
        startDate: experience.startDate,
        endDate: isPresent ? "" : experience.endDate,
        current: isPresent,
        location: experience.location,
        responsibilities: [...experience.bullets],
        achievements: fallback?.achievements ?? [],
      };
    }),
    education: resume.education.map((education) => {
      const isPresent = education.endDate === "Present";
      return {
        id: education.id,
        institution: education.institution,
        degree: education.degree,
        field: education.field,
        startDate: education.startDate,
        endDate: isPresent ? "" : education.endDate,
        current: isPresent,
        gpa: education.gpa ?? "",
        achievements: [...education.achievements],
      };
    }),
    achievements: resume.achievements.map((achievement) => ({
      ...(existingAchievements.get(achievement.id) ?? achievement),
      ...achievement,
    })),
    certificates: resume.certificates.map((certificate) => ({
      ...(existingCertificates.get(certificate.id) ?? {
        id: certificate.id,
        name: "",
        issuer: "",
        date: "",
        credentialId: "",
        url: "",
      }),
      id: certificate.id,
      name: certificate.name,
      issuer: certificate.issuer,
      date: certificate.date,
      url: certificate.url ?? "",
    })),
    leadership: resume.leadership.map((leadership) => ({
      ...(existingLeadership.get(leadership.id) ?? {
        id: leadership.id,
        role: "",
        organization: "",
        startDate: "",
        endDate: "",
        description: "",
      }),
      id: leadership.id,
      role: leadership.role,
      organization: leadership.org,
      startDate: existingLeadership.get(leadership.id)?.startDate ?? "",
      endDate: existingLeadership.get(leadership.id)?.endDate ?? "",
      description: leadership.bullets.join(" "),
    })),
    languages: resume.languages.map((language) => ({
      ...(existingLanguages.get(language.id) ?? {
        id: language.id,
        name: "",
        proficiency: "Basic",
      }),
      id: language.id,
      name: language.name,
      proficiency: (language.level as BuilderState["languages"][number]["proficiency"]) || "Basic",
    })),
    interests: [...resume.interests],
  };
}

export function createBuilderDraft(builder: BuilderState, existing?: ResumeDraft | null, updatedAt = new Date()): ResumeDraft {
  const savedAt = updatedAt.toISOString();
  const nextBuilder = {
    ...builder,
    lastSaved: updatedAt,
  };

  return {
    builder: nextBuilder,
    resume: builderToResume(nextBuilder),
    sections: existing?.sections ? [...existing.sections] : [...DEFAULT_SECTIONS],
    settings: existing?.settings ? { ...existing.settings } : { ...DEFAULT_SETTINGS },
    updatedAt: savedAt,
  };
}

export function createStudioDraft(
  resume: ResumeData,
  existing?: ResumeDraft | null,
  updatedAt = new Date(),
  overrides?: { sections?: ResumeSection[]; settings?: StudioSettings }
): ResumeDraft {
  const savedAt = updatedAt.toISOString();
  const nextBuilder = resumeToBuilder(resume, existing?.builder);

  return {
    builder: {
      ...nextBuilder,
      lastSaved: updatedAt,
    },
    resume,
    sections: overrides?.sections ? [...overrides.sections] : existing?.sections ? [...existing.sections] : [...DEFAULT_SECTIONS],
    settings: overrides?.settings ? { ...overrides.settings } : existing?.settings ? { ...existing.settings } : { ...DEFAULT_SETTINGS },
    updatedAt: savedAt,
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
