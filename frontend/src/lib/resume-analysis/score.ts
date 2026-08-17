import type { BuilderState, ResumeData, ResumeSection, StudioSettings } from "@/types";
import { CONTACT_FIELD_LABELS, getKeywordSet } from "./rules";
import {
  clamp,
  countSentences,
  countWords,
  hasGenericPhrase,
  hasMetric,
  hasStrongVerb,
  normalize,
  parseYear,
  uniqueStrings,
} from "./helpers";
import type { KeywordCoverage, ReadabilityMetrics, SummaryQuality } from "./types";

export interface BulletSample {
  text: string;
  section: string;
}

export interface ScoreInputs {
  builder: BuilderState;
  resume: ResumeData;
  sections: ResumeSection[];
  settings: StudioSettings;
  corpus: string;
  bullets: BulletSample[];
}

export function computeContactScore(resume: ResumeData): {
  score: number;
  checks: { label: string; value: string; state: "pass" | "warn"; note: string }[];
} {
  const header = resume.header;
  const contactValues = {
    name: header.name,
    email: header.email,
    phone: header.phone,
    location: header.location,
    linkedin: header.linkedin,
    github: header.github,
    portfolio: header.portfolio,
  };

  const checks = CONTACT_FIELD_LABELS.map((field) => {
    const value = String(contactValues[field.key]).trim();

    if (!value) {
      return {
        label: field.label,
        value: "Missing",
        state: "warn" as const,
        note: `Add a ${field.label.toLowerCase()} for ATS parsing.`,
      };
    }

    const noteMap: Record<string, string> = {
      name: "Name is present and easy to parse.",
      email: "Email address is present.",
      phone: "Phone number is present.",
      location: "Location is present.",
      linkedin: "LinkedIn URL is present.",
      github: "GitHub URL is present.",
      portfolio: "Portfolio link is present.",
    };

    return {
      label: field.label,
      value,
      state: "pass" as const,
      note: noteMap[field.key] ?? "Present.",
    };
  });

  const score = clamp((checks.filter((check) => check.state === "pass").length / checks.length) * 100);
  return { score, checks };
}

export function computeSectionCompletion(builder: BuilderState, sections: ResumeSection[]): number {
  if (!sections.length) return 0;

  const sectionHasData: Record<string, boolean> = {
    header: Boolean(
      builder.personalInfo.firstName ||
        builder.personalInfo.lastName ||
        builder.personalInfo.email ||
        builder.personalInfo.phone ||
        builder.personalInfo.location ||
        builder.personalInfo.linkedin ||
        builder.personalInfo.github ||
        builder.personalInfo.portfolio
    ),
    summary: Boolean(builder.summary.trim()),
    experience: builder.experience.length > 0,
    education: builder.education.length > 0,
    skills: builder.skills.length > 0,
    projects: builder.projects.length > 0,
    achievements: builder.achievements.length > 0,
    certificates: builder.certificates.length > 0,
    leadership: builder.leadership.length > 0,
    languages: builder.languages.length > 0,
    interests: builder.interests.length > 0,
  };

  const visibleSections = sections.filter((section) => section.visible);
  const completed = visibleSections.filter((section) => sectionHasData[section.type]).length;
  return clamp((completed / visibleSections.length) * 100);
}

export function computeResumeCompleteness(builder: BuilderState, resume: ResumeData): number {
  const contactScore = computeContactScore(resume).score;
  const checks = [
    Boolean(builder.summary.trim()),
    builder.experience.length > 0,
    builder.skills.length > 0,
    builder.projects.length > 0,
    builder.education.length > 0,
    builder.achievements.length > 0,
    builder.certificates.length > 0,
    builder.leadership.length > 0,
    builder.languages.length > 0,
    Boolean(builder.interests.length),
  ];

  const weighted =
    contactScore * 0.2 +
    (checks[0] ? 100 : 0) * 0.12 +
    (checks[1] ? 100 : 0) * 0.15 +
    (checks[2] ? 100 : 0) * 0.12 +
    (checks[3] ? 100 : 0) * 0.12 +
    (checks[4] ? 100 : 0) * 0.1 +
    (checks[5] ? 100 : 0) * 0.07 +
    (checks[6] ? 100 : 0) * 0.07 +
    (checks[7] ? 100 : 0) * 0.05 +
    (checks[8] ? 100 : 0) * 0.04 +
    (checks[9] ? 100 : 0) * 0.03;

  return clamp(weighted);
}

export function computeKeywordCoverage(resume: ResumeData, settings: StudioSettings, corpus: string): KeywordCoverage {
  const rules = getKeywordSet(resume, settings);
  const normalizedCorpus = normalize(corpus);

  const matched = rules
    .filter((rule) => normalize(rule.word).split(/\s+/).every((token) => normalizedCorpus.includes(token)))
    .map((rule) => rule.word);

  const missing = rules
    .filter((rule) => !matched.includes(rule.word))
    .map((rule) => rule.word);

  const totalWeight = rules.reduce((sum, rule) => sum + rule.weight, 0) || 1;
  const matchedWeight = rules
    .filter((rule) => matched.includes(rule.word))
    .reduce((sum, rule) => sum + rule.weight, 0);
  const weightOf = (word: string) => rules.find((rule) => rule.word === word)?.weight ?? 0;

  const score = clamp((matchedWeight / totalWeight) * 100);
  const recommended = uniqueStrings([
    ...missing.filter((word) => weightOf(word) >= 2).slice(0, 5),
    ...missing.filter((word) => weightOf(word) === 1).slice(0, 2),
  ]);

  return { matched, missing, recommended, score };
}

export function computeSummaryQuality(summary: string, targetRole: string): SummaryQuality {
  const length = countWords(summary);
  const sentences = countSentences(summary);
  const hasMetricValue = hasMetric(summary);
  const hasStrong = hasStrongVerb(summary);
  const includesTargetRole = targetRole ? normalize(summary).includes(normalize(targetRole).split(" ")[0] ?? "") : false;
  const genericPenalty = hasGenericPhrase(summary) ? 12 : 0;

  const lengthScore =
    length >= 28 && length <= 55 ? 38 : length >= 20 && length <= 65 ? 30 : length >= 12 ? 20 : 10;
  const structureScore = sentences >= 2 && sentences <= 3 ? 20 : sentences === 1 ? 12 : 15;
  const contentScore = (hasMetricValue ? 18 : 8) + (hasStrong ? 12 : 4) + (includesTargetRole ? 8 : 4);
  const score = clamp(lengthScore + structureScore + contentScore - genericPenalty);

  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const suggestions: string[] = [];

  if (length >= 25 && length <= 55) strengths.push("Summary length is within the recruiter-friendly range.");
  else weaknesses.push("Summary length could be tightened to 2-3 concise sentences.");

  if (hasMetricValue) strengths.push("Summary includes measurable impact.");
  else suggestions.push("Add one quantified achievement or scale signal to the summary.");

  if (hasStrong) strengths.push("Summary starts with an active, credible professional voice.");
  else suggestions.push("Start with a stronger action verb and a direct value proposition.");

  if (genericPenalty > 0) weaknesses.push("Summary contains generic phrases that dilute impact.");
  if (includesTargetRole) strengths.push("Summary aligns with the target role.");
  else suggestions.push("Reference the target role or specialty more explicitly.");

  return { score, length, strengths: uniqueStrings(strengths), weaknesses: uniqueStrings(weaknesses), suggestions: uniqueStrings(suggestions) };
}

export function computeReadability(bullets: BulletSample[], summary: string): ReadabilityMetrics {
  const bulletWordCounts = bullets.map((bullet) => countWords(bullet.text));
  const averageWordsPerBullet = bulletWordCounts.length
    ? bulletWordCounts.reduce((sum, value) => sum + value, 0) / bulletWordCounts.length
    : 0;
  const averageSummaryWords = countWords(summary);
  const quantifiedBullets = bullets.filter((bullet) => hasMetric(bullet.text)).length;
  const metricDensity = bullets.length ? quantifiedBullets / bullets.length : 0;

  const idealBulletScore = averageWordsPerBullet >= 9 && averageWordsPerBullet <= 20 ? 40 : averageWordsPerBullet >= 7 ? 28 : 14;
  const summaryScore = averageSummaryWords >= 20 && averageSummaryWords <= 45 ? 25 : averageSummaryWords >= 12 ? 20 : 10;
  const metricScore = clamp(metricDensity * 35);
  const varietyScore = bullets.length >= 8 ? 15 : bullets.length >= 4 ? 10 : 6;

  return {
    score: clamp(idealBulletScore + summaryScore + metricScore + varietyScore),
    averageWordsPerBullet: Number(averageWordsPerBullet.toFixed(1)),
    averageWordsPerExperienceBullet: Number(averageWordsPerBullet.toFixed(1)),
    averageSummaryWords,
    quantifiedBullets,
    metricDensity: Number(metricDensity.toFixed(2)),
  };
}

export function computeExperienceScore(builder: BuilderState, bullets: BulletSample[]): number {
  const experienceCount = builder.experience.length;
  const quantifiedBullets = bullets.filter((bullet) => hasMetric(bullet.text)).length;
  const strongVerbCount = bullets.filter((bullet) => hasStrongVerb(bullet.text)).length;

  const countScore = experienceCount >= 3 ? 25 : experienceCount === 2 ? 20 : experienceCount === 1 ? 12 : 0;
  const metricScore = bullets.length ? clamp((quantifiedBullets / bullets.length) * 45) : 0;
  const verbScore = bullets.length ? clamp((strongVerbCount / bullets.length) * 30) : 0;
  const recencyScore = builder.experience.some((item) => item.current) ? 10 : 6;

  return clamp(countScore + metricScore + verbScore + recencyScore);
}

export function computeSkillsScore(resume: ResumeData, keywordCoverage: KeywordCoverage): number {
  const allSkills = uniqueStrings(resume.skills.flatMap((group) => group.skills));
  const categoryCount = uniqueStrings(resume.skills.map((group) => group.category)).length;
  const skillCount = allSkills.length;
  const densityScore = skillCount >= 12 ? 40 : skillCount >= 8 ? 32 : skillCount >= 5 ? 24 : 12;
  const diversityScore = categoryCount >= 3 ? 30 : categoryCount === 2 ? 20 : 10;
  const coverageScore = keywordCoverage.score * 0.3;

  return clamp(densityScore + diversityScore + coverageScore);
}

export function computeGrammarScore(corpus: string): number {
  const normalizedCorpus = normalize(corpus);
  const weakVerbCount = WEAK_VERBS_COUNT(normalizedCorpus);
  const genericCount = GENERIC_PHRASES_COUNT(normalizedCorpus);
  const repeatedSpaces = corpus.includes("  ") ? 2 : 0;
  const punctuationPenalty = /!!|\?\?|\.{4,}/.test(corpus) ? 4 : 0;

  return clamp(100 - weakVerbCount * 5 - genericCount * 4 - repeatedSpaces - punctuationPenalty);
}

export function computeFormattingScore(builder: BuilderState, settings: StudioSettings): number {
  const marginScore =
    settings.margins >= 24 && settings.margins <= 48 ? 30 : settings.margins >= 18 ? 20 : 12;
  const lineHeightScore =
    settings.lineHeight >= 1.25 && settings.lineHeight <= 1.6 ? 25 : settings.lineHeight >= 1.15 ? 18 : 10;
  const fontSizeScore = settings.fontSize >= 9 && settings.fontSize <= 11 ? 20 : settings.fontSize >= 8 ? 14 : 8;
  const sectionScore = builder.experience.length > 0 && builder.skills.length > 0 ? 15 : 8;
  const templateScore = settings.template === "corporate" ? 12 : settings.template === "minimal" ? 14 : 18;

  return clamp(marginScore + lineHeightScore + fontSizeScore + sectionScore + templateScore);
}

export function computeAtsReadiness(args: {
  contactScore: number;
  keywordCoverage: KeywordCoverage;
  summaryQuality: SummaryQuality;
  formattingScore: number;
  readabilityScore: number;
  sectionCompletion: number;
}): number {
  const score =
    args.contactScore * 0.18 +
    args.keywordCoverage.score * 0.24 +
    args.summaryQuality.score * 0.14 +
    args.formattingScore * 0.16 +
    args.readabilityScore * 0.14 +
    args.sectionCompletion * 0.14;

  return clamp(score);
}

export function computeOverallScore(args: {
  completeness: number;
  ats: number;
  readability: number;
  experience: number;
  skills: number;
  grammar: number;
}): number {
  return clamp(
    args.completeness * 0.22 +
      args.ats * 0.28 +
      args.readability * 0.14 +
      args.experience * 0.14 +
      args.skills * 0.12 +
      args.grammar * 0.1
  );
}

export function quantifyTargetCompany(builder: BuilderState): string {
  return builder.targetCompany.trim() || "Target company not set";
}

function WEAK_VERBS_COUNT(text: string): number {
  return [
    "helped",
    "worked on",
    "responsible for",
    "assisted",
    "supported",
    "participated",
    "involved",
  ].reduce((sum, phrase) => sum + (text.includes(phrase) ? 1 : 0), 0);
}

function GENERIC_PHRASES_COUNT(text: string): number {
  return [
    "passionate",
    "detail oriented",
    "team player",
    "worked on",
    "helped",
    "responsible for",
  ].reduce((sum, phrase) => sum + (text.includes(phrase) ? 1 : 0), 0);
}

export function summarizeEducationStatus(builder: BuilderState): string {
  if (!builder.education.length) return "No education section detected";

  const years = builder.education.map((item) => [parseYear(item.startDate), parseYear(item.endDate)].filter(Boolean)).flat().filter(Boolean) as number[];
  if (!years.length) return "Education section is present";

  const oldest = Math.min(...years);
  const currentYear = new Date().getFullYear();
  const age = currentYear - oldest;

  if (age >= 10) return "Education section includes older dates; consider removing graduation years if appropriate";
  return "Education dates are recent and ATS-friendly";
}

export function calculateTargetRole(resume: ResumeData): string {
  return resume.header.title.trim() || "Unspecified target role";
}
