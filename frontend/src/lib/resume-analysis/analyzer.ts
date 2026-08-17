import { useMemo } from "react";
import type { BuilderState, ResumeData, StudioSettings } from "@/types";
import { readResumeDraft, useResumeDraftSnapshot, type ResumeDraft } from "@/lib/resume-draft";
import { clamp, countWords, hasGenericPhrase, hasMetric, hasStrongVerb, hasWeakVerb, normalize, scoreStatus, uniqueStrings, statusFromScore } from "./helpers";
import type {
  AnalysisScoreCard,
  AnalysisSectionItem,
  AnalysisSnapshot,
  AtsSimulationLine,
  FormattingMetric,
  WeakBulletSuggestion,
} from "./types";
import {
  computeAtsReadiness,
  computeContactScore,
  computeExperienceScore,
  computeFormattingScore,
  computeGrammarScore,
  computeKeywordCoverage,
  computeOverallScore,
  computeReadability,
  computeResumeCompleteness,
  computeSectionCompletion,
  computeSkillsScore,
  computeSummaryQuality,
  summarizeEducationStatus,
  calculateTargetRole,
  type BulletSample,
} from "./score";
import { buildRecommendationBundle } from "./recommendations";
function createEmptyResume(): ResumeData {
  return {
    header: {
      name: "",
      title: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      github: "",
      portfolio: "",
    },
    summary: "",
    experience: [],
    education: [],
    skills: [],
    projects: [],
    achievements: [],
    certificates: [],
    leadership: [],
    languages: [],
    interests: [],
  };
}

function collectBullets(resume: ResumeData): BulletSample[] {
  const experienceBullets = resume.experience.flatMap((item) =>
    item.bullets.map((bullet) => ({
      text: bullet,
      section: `${item.role || "Experience"} at ${item.company || "Current role"}`,
    }))
  );

  const projectBullets = resume.projects.flatMap((item) =>
    item.bullets.map((bullet) => ({
      text: bullet,
      section: item.name || "Project",
    }))
  );

  const leadershipBullets = resume.leadership.flatMap((item) =>
    item.bullets.map((bullet) => ({
      text: bullet,
      section: item.role || "Leadership",
    }))
  );

  const achievementBullets = resume.achievements.map((item) => ({
    text: item.description || item.title,
    section: item.title || "Achievement",
  }));

  return [...experienceBullets, ...projectBullets, ...leadershipBullets, ...achievementBullets];
}

function buildCorpus(resume: ResumeData, builder: BuilderState): string {
  return [
    resume.header.name,
    resume.header.title,
    resume.header.email,
    resume.header.phone,
    resume.header.location,
    resume.header.linkedin,
    resume.header.github,
    resume.header.portfolio,
    resume.summary,
    resume.experience.map((item) => [item.company, item.role, item.location, ...item.bullets].join(" ")).join(" "),
    resume.education.map((item) => [item.institution, item.degree, item.field, item.gpa, ...item.achievements].join(" ")).join(" "),
    resume.skills.map((group) => [group.category, ...group.skills].join(" ")).join(" "),
    resume.projects.map((item) => [item.name, item.description, item.github, item.demo, ...item.tech, ...item.bullets].join(" ")).join(" "),
    resume.achievements.map((item) => [item.title, item.description, item.date].join(" ")).join(" "),
    resume.certificates.map((item) => [item.name, item.issuer, item.date, item.url].join(" ")).join(" "),
    resume.leadership.map((item) => [item.role, item.org, item.duration, ...item.bullets].join(" ")).join(" "),
    resume.languages.map((item) => [item.name, item.level].join(" ")).join(" "),
    resume.interests.join(" "),
    builder.careerGoal ?? "",
    builder.experienceLevel ?? "",
    builder.targetCompany,
    builder.companyType ?? "",
  ].join(" ");
}

function scoreBullet(text: string): number {
  let score = 100;
  const normalized = normalize(text);

  if (hasWeakVerb(text)) score -= 22;
  if (hasGenericPhrase(text)) score -= 10;
  if (!hasStrongVerb(text)) score -= 12;
  if (!hasMetric(text)) score -= 18;
  if (countWords(text) < 8) score -= 6;
  if (countWords(text) > 30) score -= 6;
  if (/^\s*(worked on|helped|responsible for|assisted)\b/i.test(text)) score -= 8;
  if (/\b(passionate|hard worker|detail oriented|team player)\b/i.test(normalized)) score -= 8;

  return clamp(score);
}

function buildImprovedBullet(original: string): string {
  const normalized = normalize(original);
  const topic = original
    .replace(/^(worked on|helped|assisted|supported|responsible for|contributed to)\s+/i, "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^\w/, (value) => value.toLowerCase());

  if (normalized.includes("performance") || normalized.includes("load time")) {
    return "Improved website performance by reducing load time and increasing user retention through code splitting and image optimization.";
  }

  if (normalized.includes("api")) {
    return "Collaborated with backend engineers to design and deploy a measurable API improvement with clear throughput or latency gains.";
  }

  if (normalized.includes("mvp") || normalized.includes("product")) {
    return "Shipped the product faster by quantifying adoption, conversion, or revenue impact from the launch.";
  }

  if (normalized.includes("resume")) {
    return "Improved the resume workflow by making the experience measurable, ATS-friendly, and easier to parse for recruiters.";
  }

  if (topic) {
    return `Strengthened ${topic} by adding a measurable result, specific scale, or business outcome.`;
  }

  return "Rewrite this bullet with a stronger verb, a metric, and the business outcome.";
}

function buildWeakBulletSuggestions(bullets: BulletSample[]): WeakBulletSuggestion[] {
  return bullets
    .map((bullet, index) => {
      const score = scoreBullet(bullet.text);
      return {
        id: `${index}-${bullet.section}`,
        original: bullet.text,
        suggestion: buildImprovedBullet(bullet.text),
        score,
        section: bullet.section,
      };
    })
    .filter((bullet) => bullet.score <= 82)
    .sort((left, right) => left.score - right.score)
    .slice(0, 4);
}

function buildSectionAnalysis(args: {
  builder: BuilderState;
  resume: ResumeData;
  summaryQualityScore: number;
  readabilityScore: number;
  skillsScore: number;
  experienceScore: number;
  keywordCoverageScore: number;
  contactScore: number;
  formattingScore: number;
  sectionCompletion: number;
}): AnalysisSectionItem[] {
  const { builder, resume } = args;
  const skillCount = uniqueStrings(resume.skills.flatMap((group) => group.skills)).length;

  return [
    {
      id: "contact",
      name: "Header & Contact",
      score: args.contactScore,
      strengths: [
        resume.header.email ? "Email is present for ATS contact parsing." : "Email is missing.",
        resume.header.phone ? "Phone number is included." : "Phone number is missing.",
      ].filter((item) => !item.includes("missing")),
      weaknesses: [
        !resume.header.linkedin ? "LinkedIn profile is missing." : "",
        !resume.header.github && !resume.header.portfolio ? "GitHub or portfolio link is missing." : "",
      ].filter(Boolean) as string[],
      suggestions: [
        !resume.header.linkedin ? "Add a LinkedIn URL to strengthen recruiter contactability." : "",
        !resume.header.github && !resume.header.portfolio ? "Include GitHub or portfolio proof of work." : "",
      ].filter(Boolean) as string[],
    },
    {
      id: "summary",
      name: "Professional Summary",
      score: args.summaryQualityScore,
      strengths: args.summaryQualityScore >= 80 ? ["Concise summary length supports quick scanning."] : [],
      weaknesses:
        args.summaryQualityScore < 80 ? ["Summary needs sharper impact language or a quantified result."] : [],
      suggestions:
        args.summaryQualityScore < 90 ? ["Add one more quantified achievement or target-role keyword."] : [],
    },
    {
      id: "experience",
      name: "Experience",
      score: args.experienceScore,
      strengths: [
        builder.experience.length >= 2 ? "Multiple roles demonstrate career progression." : "Experience section is present.",
        args.readabilityScore >= 70 ? "Bullets are readable and recruiter-friendly." : "",
      ].filter(Boolean) as string[],
      weaknesses:
        args.experienceScore < 85
          ? ["A few bullets could include stronger metrics or outcome language."]
          : [],
      suggestions:
        args.experienceScore < 95
          ? ["Quantify the weakest bullet in your most recent role."]
          : [],
    },
    {
      id: "skills",
      name: "Skills",
      score: args.skillsScore,
      strengths: [
        skillCount >= 8 ? "Skills section has healthy breadth." : "Skills section is present.",
        args.keywordCoverageScore >= 70 ? "Many ATS keywords are already covered." : "",
      ].filter(Boolean) as string[],
      weaknesses:
        args.skillsScore < 85
          ? ["Consider adding one or two high-value role keywords."]
          : [],
      suggestions:
        args.keywordCoverageScore < 90
          ? ["Add the most relevant missing keyword from the ATS coverage list."]
          : [],
    },
    {
      id: "projects",
      name: "Projects",
      score: clamp(args.formattingScore * 0.6 + args.readabilityScore * 0.4),
      strengths:
        resume.projects.length > 0
          ? ["Projects section demonstrates hands-on execution."]
          : [],
      weaknesses:
        resume.projects.length > 0 && resume.projects.some((project) => project.bullets.some((bullet) => !hasMetric(bullet)))
          ? ["At least one project bullet could show a measurable result."]
          : [],
      suggestions:
        resume.projects.length > 0
          ? ["Add user, revenue, or performance metrics to the strongest project bullet."]
          : ["Add a project that demonstrates measurable product impact."],
    },
    {
      id: "education",
      name: "Education",
      score: clamp(args.sectionCompletion >= 100 ? 100 : args.sectionCompletion),
      strengths:
        builder.education.length > 0
          ? ["Education section is present and ATS-readable."]
          : [],
      weaknesses:
        builder.education.length > 0 && summarizeEducationStatus(builder).includes("older")
          ? ["Education dates are older and could be shortened for age-bias protection."]
          : [],
      suggestions:
        builder.education.length > 0 && summarizeEducationStatus(builder).includes("older")
          ? ["Remove graduation year if the degree is more than 10 years old and not required."]
          : [],
    },
  ];
}

function buildFormattingMetrics(builder: BuilderState, settings: StudioSettings): FormattingMetric[] {
  const visibleSections = [
    builder.experience.length > 0,
    builder.education.length > 0,
    builder.skills.length > 0,
    builder.projects.length > 0,
  ].filter(Boolean).length;

  const whiteSpaceScore = clamp(
    settings.margins >= 24 && settings.margins <= 48 ? 92 : settings.margins >= 18 ? 82 : 70
  );
  const alignmentScore = clamp(settings.template === "corporate" ? 100 : visibleSections >= 3 ? 96 : 84);
  const fontScore = clamp(settings.fontSize >= 9 && settings.fontSize <= 11 ? 95 : 88);
  const spacingScore = clamp(settings.lineHeight >= 1.25 && settings.lineHeight <= 1.6 ? 90 : 80);

  return [
    { name: "White Space", score: whiteSpaceScore, status: scoreStatus(whiteSpaceScore), icon: "MoveHorizontal" },
    { name: "Alignment", score: alignmentScore, status: scoreStatus(alignmentScore), icon: "AlignLeft" },
    { name: "Font Consistency", score: fontScore, status: scoreStatus(fontScore), icon: "Type" },
    { name: "Section Spacing", score: spacingScore, status: scoreStatus(spacingScore), icon: "MoveVertical" },
  ];
}

function buildAtsSimulation(args: {
  builder: BuilderState;
  resume: ResumeData;
  contactChecks: ReturnType<typeof computeContactScore>["checks"];
  sectionCompletion: number;
  formattingScore: number;
}): AtsSimulationLine[] {
  const hasStandardHeadings = args.builder.summary.trim() && args.builder.experience.length > 0 && args.builder.education.length > 0;
  const noComplexLayouts = args.builder.projects.length >= 0;
  const contactReady = args.contactChecks.filter((check) => check.state === "pass").length >= 5;
  const educationStatus = summarizeEducationStatus(args.builder);
  const dateWarnings = educationStatus.includes("older") ? "Education dates are older than 10 years; consider removing them." : "Education dates are easy to parse.";

  return [
    {
      id: "headings",
      state: hasStandardHeadings ? "pass" : "warn",
      message: hasStandardHeadings
        ? "Standard headings correctly identified (Summary, Experience, Education)."
        : "Add clear Summary, Experience, and Education headings for ATS parsing.",
    },
    {
      id: "layout",
      state: noComplexLayouts ? "pass" : "warn",
      message: noComplexLayouts
        ? "No complex tables or columns detected."
        : "Complex columns or tables may reduce ATS parsing reliability.",
    },
    {
      id: "contact",
      state: contactReady ? "pass" : "warn",
      message: contactReady
        ? "Contact information parsed successfully."
        : "Add the missing contact details so ATS can identify you consistently.",
    },
    {
      id: "dates",
      state: args.formattingScore >= 85 ? "pass" : "warn",
      message: dateWarnings,
    },
  ];
}

function buildStrengthsAndWeaknesses(args: {
  contactScore: number;
  keywordCoverage: ReturnType<typeof computeKeywordCoverage>;
  summaryQuality: ReturnType<typeof computeSummaryQuality>;
  readability: ReturnType<typeof computeReadability>;
  experienceScore: number;
  skillsScore: number;
  formattingScore: number;
  weakBullets: WeakBulletSuggestion[];
}): { strengths: string[]; weaknesses: string[]; suggestions: string[] } {
  const strengths = [
    args.contactScore >= 100 ? "Contact information is complete." : "",
    args.keywordCoverage.score >= 80 ? "ATS keyword coverage is solid." : "",
    args.summaryQuality.strengths[0] ?? "",
    args.readability.score >= 80 ? "Bullet length and flow are recruiter-friendly." : "",
    args.experienceScore >= 85 ? "Experience section contains quantified outcomes." : "",
    args.skillsScore >= 80 ? "Skills section has good breadth and category balance." : "",
    args.formattingScore >= 85 ? "Formatting looks clean and ATS-safe." : "",
  ].filter(Boolean);

  const weaknesses = [
    ...args.summaryQuality.weaknesses,
    ...(args.keywordCoverage.missing.length > 0 ? [`Missing ATS keywords: ${args.keywordCoverage.missing.slice(0, 3).join(", ")}.`] : []),
    ...(args.weakBullets.length > 0 ? ["One or more bullets could use stronger metrics or action verbs."] : []),
    ...(args.contactScore < 100 ? ["Some contact fields are missing."] : []),
  ];

  const suggestions = uniqueStrings([
    ...args.summaryQuality.suggestions,
    ...(args.keywordCoverage.recommended.length > 0
      ? [`Add ${args.keywordCoverage.recommended.slice(0, 3).join(", ")} where relevant.`]
      : []),
    ...(args.weakBullets[0] ? [args.weakBullets[0].suggestion] : []),
  ]);

  return {
    strengths: uniqueStrings(strengths),
    weaknesses: uniqueStrings(weaknesses),
    suggestions,
  };
}

export function analyzeResumeDraft(draft: ResumeDraft | null): AnalysisSnapshot {
  const fallbackBuilder = draft?.builder ?? {
    currentStep: 0,
    careerGoal: null,
    targetRole: "",
    experienceLevel: null,
    targetCompany: "",
    companyType: null,
    personalInfo: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      github: "",
      portfolio: "",
    },
    summary: "",
    skills: [],
    projects: [],
    experience: [],
    education: [],
    achievements: [],
    certificates: [],
    leadership: [],
    languages: [],
    interests: [],
    lastSaved: null,
  };

  const resume = draft?.resume ?? createEmptyResume();
  const builder = fallbackBuilder;
  const sections = draft?.sections ?? [];
  const settings = draft?.settings ?? {
    template: "classic",
    theme: "light",
    accentColor: "#6366f1",
    fontFamily: "Inter",
    fontSize: 10,
    lineHeight: 1.4,
    margins: 32,
    zoom: 100,
  };

  const contact = computeContactScore(resume);
  const sectionCompletion = computeSectionCompletion(builder, sections);
  const completeness = computeResumeCompleteness(builder, resume);
  const bullets = collectBullets(resume);
  const corpus = buildCorpus(resume, builder);
  const keywordCoverage = computeKeywordCoverage(resume, settings, corpus);
  const summaryQuality = computeSummaryQuality(resume.summary, calculateTargetRole(resume));
  const readability = computeReadability(bullets, resume.summary);
  const grammar = computeGrammarScore(corpus);
  const experience = computeExperienceScore(builder, bullets);
  const skills = computeSkillsScore(resume, keywordCoverage);
  const formatting = computeFormattingScore(builder, settings);
  const weakBullets = buildWeakBulletSuggestions(bullets);
  const impact = clamp(readability.metricDensity * 70 + (100 - weakBullets.length * 15) * 0.3);
  const ats = computeAtsReadiness({
    contactScore: contact.score,
    keywordCoverage,
    summaryQuality,
    formattingScore: formatting,
    readabilityScore: readability.score,
    sectionCompletion,
  });
  const overall = computeOverallScore({
    completeness,
    ats,
    readability: readability.score,
    experience,
    skills,
    grammar,
  });
  const sectionAnalysis = buildSectionAnalysis({
    builder,
    resume,
    summaryQualityScore: summaryQuality.score,
    readabilityScore: readability.score,
    skillsScore: skills,
    experienceScore: experience,
    keywordCoverageScore: keywordCoverage.score,
    contactScore: contact.score,
    formattingScore: formatting,
    sectionCompletion,
  });
  const formattingMetrics = buildFormattingMetrics(builder, settings);
  const atsSimulation = buildAtsSimulation({
    builder,
    resume,
    contactChecks: contact.checks,
    sectionCompletion,
    formattingScore: formatting,
  });
  const totals = {
    skillsCount: uniqueStrings(resume.skills.flatMap((group) => group.skills)).length,
    projectCount: resume.projects.length,
    experienceCount: resume.experience.length,
    educationCount: resume.education.length,
    certificatesCount: resume.certificates.length,
    achievementsCount: resume.achievements.length,
    languagesCount: resume.languages.length,
  };
  const educationStatus = summarizeEducationStatus(builder);
  const role = calculateTargetRole(resume);
  const targetCompany = builder.targetCompany.trim() || "Current target company not set";
  const verdict =
    overall >= 90 ? "Ready for submission" : overall >= 80 ? "Strong foundation" : overall >= 70 ? "Needs refinement" : "Requires attention";
  const verdictDescription = `Your resume scores ${overall}/100 with ${keywordCoverage.matched.length} matched keywords and ${contact.score}% contact completeness.`;
  const verdictProgress = overall;
  const proTipTitle = educationStatus.includes("older") ? "The 10-Year Rule" : "ATS Keyword Match";
  const proTip = educationStatus.includes("older")
    ? "Remove graduation dates if they are over 10 years old to reduce age-bias risk, unless a role specifically asks for them."
    : keywordCoverage.missing.length > 0
      ? `Try matching the exact phrasing of ${keywordCoverage.missing[0]} where it fits naturally.`
      : "Keep reinforcing measurable impact in each bullet — the ATS likes specific outcomes.";
  const factTitle = "Keyword Coverage";
  const fact = `Matched ${keywordCoverage.matched.length} of ${keywordCoverage.matched.length + keywordCoverage.missing.length} high-value keywords.`;
  const lastSavedLabel = draft?.updatedAt ? new Date(draft.updatedAt).toLocaleString() : "Not saved yet";
  const heroStatus = draft ? "Saved resume loaded from local storage" : "No saved resume found";
  const heroDescription = draft
    ? `Your saved ResumeOS draft was loaded from local storage and analyzed with deterministic rules.`
    : "Create and save a resume in Sprint 1 to unlock the live analysis.";

  const { strengths, weaknesses, suggestions } = buildStrengthsAndWeaknesses({
    contactScore: contact.score,
    keywordCoverage,
    summaryQuality,
    readability,
    experienceScore: experience,
    skillsScore: skills,
    formattingScore: formatting,
    weakBullets,
  });
  const recommendationBundle = buildRecommendationBundle(
    {
      overallScore: overall,
      summaryQuality,
      readability,
      keywordCoverage,
      contactChecks: contact.checks,
      skillsCount: totals.skillsCount,
      projectCount: totals.projectCount,
      experienceCount: totals.experienceCount,
      educationStatus,
      certificatesCount: totals.certificatesCount,
      achievementsCount: totals.achievementsCount,
      formattingMetrics,
      weakBullets,
    },
    builder,
    resume
  );

  const scoreCards: AnalysisScoreCard[] = [
    {
      id: "ats",
      title: "ATS Compatibility",
      score: ats,
      status: statusFromScore(ats),
      description:
        ats >= 90
          ? "Your resume parses cleanly and covers the most important ATS signals."
          : "Your resume needs a few more ATS-safe adjustments.",
      icon: "Target",
      color: "text-green-500",
    },
    {
      id: "content",
      title: "Content Quality",
      score: clamp((summaryQuality.score + experience + skills) / 3),
      status: scoreStatus(clamp((summaryQuality.score + experience + skills) / 3)),
      description:
        summaryQuality.score >= 85
          ? "Strong bullet depth and a clear summary give this resume good content density."
          : "The content would benefit from sharper metrics and more role-specific detail.",
      icon: "FileText",
      color: "text-blue-500",
    },
    {
      id: "verbs",
      title: "Action Verbs",
      score: clamp(100 - weakBullets.length * 12),
      status: statusFromScore(clamp(100 - weakBullets.length * 12)),
      description:
        weakBullets.length > 0
          ? `${weakBullets.length} bullet${weakBullets.length === 1 ? "" : "s"} still rely on weaker phrasing.`
          : "Action verbs are strong throughout the resume.",
      icon: "Zap",
      color: "text-yellow-500",
    },
    {
      id: "balance",
      title: "Visual Balance",
      score: formatting,
      status: statusFromScore(formatting),
      description:
        formatting >= 90
          ? "Settings and section structure support a clean ATS-friendly layout."
          : "Formatting still has room for more spacing consistency.",
      icon: "Layout",
      color: "text-purple-500",
    },
  ];

  return {
    overallScore: overall,
    currentScore: recommendationBundle.currentScore,
    potentialScore: recommendationBundle.potentialScore,
    estimatedImprovement: recommendationBundle.estimatedImprovement,
    resumeCompleteness: completeness,
    sectionCompletion,
    atsReadiness: ats,
    grammarScore: grammar,
    experienceScore: experience,
    skillsScore: skills,
    impactScore: impact,
    contactChecks: contact.checks,
    skillsCount: totals.skillsCount,
    projectCount: totals.projectCount,
    experienceCount: totals.experienceCount,
    educationStatus,
    certificatesCount: totals.certificatesCount,
    achievementsCount: totals.achievementsCount,
    languagesCount: totals.languagesCount,
    summaryQuality,
    readability,
    keywordCoverage,
    strengths,
    weaknesses,
    suggestions,
    scoreCards,
    formattingMetrics,
    sectionAnalysis,
    weakBullets,
    roadmap: recommendationBundle.recommendations,
    recommendations: recommendationBundle.recommendations,
    recommendationGroups: recommendationBundle.recommendationGroups,
    atsSimulation,
    targetRole: role,
    targetCompany,
    verdict,
    verdictDescription,
    verdictProgress,
    proTipTitle,
    proTip,
    factTitle,
    fact,
    lastSavedLabel,
    heroStatus,
    heroDescription,
  };
}

export function useResumeAnalysis(): AnalysisSnapshot {
  const draft = useResumeDraftSnapshot();
  return useMemo(() => analyzeResumeDraft(draft), [draft]);
}

export function getCurrentResumeDraft(): ResumeDraft | null {
  return readResumeDraft();
}
