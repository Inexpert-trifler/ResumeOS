import type { ResumeData, StudioSettings } from "@/types";

export interface KeywordRule {
  word: string;
  weight: number;
}

export const ACTION_VERBS = [
  "achieved",
  "architected",
  "built",
  "collaborated",
  "created",
  "delivered",
  "deployed",
  "designed",
  "developed",
  "engineered",
  "implemented",
  "improved",
  "integrated",
  "launched",
  "led",
  "mentored",
  "migrated",
  "optimized",
  "orchestrated",
  "reduced",
  "shipped",
  "scaled",
  "streamlined",
  "transformed",
];

export const WEAK_VERBS = [
  "assisted",
  "contributed",
  "helped",
  "involved",
  "managed",
  "participated",
  "responsible",
  "supported",
  "worked on",
];

export const GENERIC_PHRASES = [
  "detail oriented",
  "fast learner",
  "hard worker",
  "passionate",
  "responsible for",
  "team player",
  "worked on",
  "helped",
];

export const SOFTWARE_KEYWORDS: KeywordRule[] = [
  { word: "TypeScript", weight: 3 },
  { word: "React", weight: 3 },
  { word: "Next.js", weight: 3 },
  { word: "Node.js", weight: 3 },
  { word: "System Design", weight: 3 },
  { word: "Distributed Systems", weight: 3 },
  { word: "Microservices", weight: 3 },
  { word: "Performance Optimization", weight: 3 },
  { word: "AWS", weight: 2 },
  { word: "Docker", weight: 2 },
  { word: "Kubernetes", weight: 2 },
  { word: "GraphQL", weight: 2 },
  { word: "CI/CD", weight: 2 },
  { word: "PostgreSQL", weight: 2 },
  { word: "Redis", weight: 2 },
  { word: "API Design", weight: 2 },
  { word: "Leadership", weight: 1 },
  { word: "Mentorship", weight: 1 },
  { word: "Testing", weight: 1 },
];

export const FRONTEND_KEYWORDS: KeywordRule[] = [
  { word: "React", weight: 3 },
  { word: "Next.js", weight: 3 },
  { word: "TypeScript", weight: 3 },
  { word: "Accessibility", weight: 2 },
  { word: "Performance Optimization", weight: 2 },
  { word: "Framer Motion", weight: 2 },
  { word: "TailwindCSS", weight: 2 },
  { word: "UI Engineering", weight: 1 },
  { word: "Design Systems", weight: 1 },
];

export const BACKEND_KEYWORDS: KeywordRule[] = [
  { word: "Node.js", weight: 3 },
  { word: "APIs", weight: 3 },
  { word: "Microservices", weight: 3 },
  { word: "Distributed Systems", weight: 3 },
  { word: "System Design", weight: 3 },
  { word: "PostgreSQL", weight: 2 },
  { word: "Redis", weight: 2 },
  { word: "Docker", weight: 2 },
  { word: "Kubernetes", weight: 2 },
  { word: "CI/CD", weight: 2 },
];

export const DEVOPS_KEYWORDS: KeywordRule[] = [
  { word: "AWS", weight: 3 },
  { word: "Docker", weight: 3 },
  { word: "Kubernetes", weight: 3 },
  { word: "CI/CD", weight: 3 },
  { word: "Infrastructure", weight: 2 },
  { word: "Observability", weight: 2 },
  { word: "Automation", weight: 2 },
  { word: "Reliability", weight: 2 },
];

export const SUMMARY_POSITIVE_PHRASES = [
  "led",
  "built",
  "launched",
  "scaled",
  "reduced",
  "improved",
  "optimized",
  "migrated",
  "mentored",
  "architected",
];

export const TARGET_COMPANY_LABELS = [
  "startup",
  "scaleup",
  "enterprise",
  "faang",
  "mnc",
  "government",
];

export const CONTACT_FIELD_LABELS = [
  { key: "name", label: "Full name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "location", label: "Location" },
  { key: "linkedin", label: "LinkedIn" },
  { key: "github", label: "GitHub" },
  { key: "portfolio", label: "Portfolio" },
] as const;

export function getKeywordSet(resume: ResumeData, settings: StudioSettings) {
  const targetRole = `${resume.header.title || ""} ${settings.template}`.toLowerCase();

  if (targetRole.includes("front")) {
    return FRONTEND_KEYWORDS;
  }

  if (targetRole.includes("devops") || targetRole.includes("platform") || targetRole.includes("infra")) {
    return DEVOPS_KEYWORDS;
  }

  if (targetRole.includes("backend") || targetRole.includes("full stack") || targetRole.includes("fullstack")) {
    return BACKEND_KEYWORDS;
  }

  return SOFTWARE_KEYWORDS;
}
