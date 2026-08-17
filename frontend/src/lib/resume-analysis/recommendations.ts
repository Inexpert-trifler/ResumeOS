import type { BuilderState, ResumeData } from "@/types";
import type {
  RecommendationCategory,
  RecommendationGroup,
  RoadmapItem,
  RecommendationRoute,
  AnalysisSeverity,
  ContactCheck,
  FormattingMetric,
  KeywordCoverage,
  ReadabilityMetrics,
  SummaryQuality,
  WeakBulletSuggestion,
} from "./types";
import { clamp } from "./helpers";

const CATEGORY_ORDER: RecommendationCategory[] = [
  "Contact Information",
  "Resume Structure",
  "Skills",
  "Projects",
  "Experience",
  "Education",
  "Achievements",
  "ATS",
  "Formatting",
];

const SEVERITY_ORDER: AnalysisSeverity[] = ["Critical", "High", "Medium", "Low"];

function severityRank(severity: AnalysisSeverity): number {
  return SEVERITY_ORDER.indexOf(severity);
}

function createRoute(pathname: "/builder" | "/studio", step?: number, hash?: string): RecommendationRoute {
  return { pathname, step, hash };
}

function createRecommendation(params: Omit<RoadmapItem, "estimatedImpact">): RoadmapItem {
  return {
    ...params,
    estimatedImpact: `+${params.estimatedScoreGain} Score`,
  };
}

function builderSection(step: number, label: string): string {
  return `Builder — ${label}`;
}

function studioSection(label: string): string {
  return `Studio — ${label}`;
}

function summarizeMissingFields(fields: string[]): string {
  return fields.length === 1 ? fields[0] : fields.slice(0, 2).join(" and ");
}

function contactRecommendations(snapshot: RecommendationAnalysisInput): RoadmapItem[] {
  const missing = snapshot.contactChecks.filter((check) => check.state !== "pass").map((check) => check.label);
  if (!missing.length) return [];

  const critical = missing.some((field) => field === "Email" || field === "Phone");
  return [
    createRecommendation({
      id: "contact-complete-header",
      category: "Contact Information",
      severity: critical ? "Critical" : "High",
      title: critical ? "Complete your contact header" : "Fill the remaining contact details",
      description: `Missing ${summarizeMissingFields(missing)} in the resume header.`,
      whyItMatters:
        "Recruiters and ATS engines use the header first; incomplete contact details can block follow-up and parsing.",
      howToFix: "Open Builder → Personal Info and add the missing contact fields.",
      targetSection: builderSection(4, "Personal Info Step"),
      estimatedScoreGain: critical ? 6 : 3,
      route: createRoute("/builder", 4),
    }),
  ];
}

function structureRecommendations(snapshot: RecommendationAnalysisInput, builder: BuilderState): RoadmapItem[] {
  const recommendations: RoadmapItem[] = [];

  if (snapshot.summaryQuality.score < 90 || !builder.summary.trim()) {
    recommendations.push(
      createRecommendation({
        id: "structure-summary",
        category: "Resume Structure",
        severity: !builder.summary.trim() ? "High" : "Medium",
        title: !builder.summary.trim() ? "Add a professional summary" : "Strengthen the professional summary",
        description: !builder.summary.trim()
          ? "Your resume is missing a summary that anchors the overall narrative."
          : "Your summary is present, but it is not yet strong enough to frame your profile clearly.",
        whyItMatters:
          "The summary is the first narrative signal recruiters read, and it helps ATS systems understand your target role.",
        howToFix: "Open Builder → Summary Step and add a concise, metric-backed summary aligned to your target role.",
        targetSection: builderSection(5, "Summary Step"),
        estimatedScoreGain: !builder.summary.trim() ? 6 : 4,
        route: createRoute("/builder", 5),
      })
    );
  }

  return recommendations;
}

function skillsRecommendations(snapshot: Pick<RecommendationAnalysisInput, "skillsCount" | "keywordCoverage">): RoadmapItem[] {
  const missingKeywords = snapshot.keywordCoverage.missing.slice(0, 4);
  const skillCount = snapshot.skillsCount;

  if (!missingKeywords.length && skillCount >= 8) return [];

  const gain = clamp(Math.max(2, 2 + missingKeywords.length * 2 + (skillCount < 5 ? 2 : 0)), 2, 10);
  return [
    createRecommendation({
      id: "skills-keywords",
      category: "Skills",
      severity: skillCount < 5 || snapshot.keywordCoverage.score < 60 ? "High" : "Medium",
      title: "Add the missing high-value skills",
      description: missingKeywords.length
        ? `ATS coverage is missing ${missingKeywords.join(", ")}.`
        : "Your skills section could be broader for stronger keyword coverage.",
      whyItMatters:
        "Skills are a primary ATS match signal and also help recruiters quickly see whether you fit the role.",
      howToFix: "Open Builder → Skills Step and add the most relevant missing terms only where they are truthful.",
      targetSection: builderSection(6, "Skills Step"),
      estimatedScoreGain: gain,
      route: createRoute("/builder", 6),
    }),
  ];
}

function projectRecommendations(snapshot: RecommendationAnalysisInput, resume: ResumeData): RoadmapItem[] {
  const projectCount = snapshot.projectCount;
  const weakProjectBullets = snapshot.weakBullets.filter((bullet) => resume.projects.some((project) => project.name === bullet.section));

  if (projectCount === 0) {
    return [
      createRecommendation({
        id: "projects-add-one",
        category: "Projects",
        severity: "High",
        title: "Add at least one project",
        description: "Your resume does not include a project section yet.",
        whyItMatters: "Projects show practical execution and give recruiters a concrete way to evaluate your skills.",
        howToFix: "Open Builder → Projects Step and add one real project with measurable outcomes.",
        targetSection: builderSection(7, "Projects Step"),
        estimatedScoreGain: 5,
        route: createRoute("/builder", 7),
      }),
    ];
  }

  if (!weakProjectBullets.length) return [];

  return [
    createRecommendation({
      id: "projects-quantify",
      category: "Projects",
      severity: "Medium",
      title: "Quantify your strongest project result",
      description: `One or more project bullets still read as responsibilities instead of outcomes.`,
      whyItMatters:
        "Projects become more compelling when they show scale, adoption, or performance impact rather than just the work performed.",
      howToFix: "Rewrite the weakest project bullet with a number, outcome, or metric in Builder → Projects Step.",
      targetSection: builderSection(7, "Projects Step"),
      estimatedScoreGain: 3,
      route: createRoute("/builder", 7),
    }),
  ];
}

function experienceRecommendations(snapshot: RecommendationAnalysisInput, resume: ResumeData): RoadmapItem[] {
  const experienceCount = snapshot.experienceCount;
  const weakExperienceBullets = snapshot.weakBullets.filter((bullet) =>
    resume.experience.some((experience) => `${experience.role} at ${experience.company}` === bullet.section)
  );

  if (experienceCount === 0) {
    return [
      createRecommendation({
        id: "experience-add",
        category: "Experience",
        severity: "High",
        title: "Add work experience entries",
        description: "Your resume is missing a work experience section.",
        whyItMatters: "Experience is the core signal for most roles and gives recruiters evidence of your progression and impact.",
        howToFix: "Open Builder → Work Experience Step and add your most relevant roles with measurable bullets.",
        targetSection: builderSection(8, "Work Experience Step"),
        estimatedScoreGain: 7,
        route: createRoute("/builder", 8),
      }),
    ];
  }

  if (!weakExperienceBullets.length) return [];

  return [
    createRecommendation({
      id: "experience-quantify",
      category: "Experience",
      severity: weakExperienceBullets.length >= 2 ? "High" : "Medium",
      title: "Quantify your experience bullets",
      description: "Some experience bullets still use weak phrasing or lack concrete metrics.",
      whyItMatters: "Experience bullets drive the recruiter’s perception of impact, ownership, and seniority.",
      howToFix: "Open Builder → Work Experience Step and rewrite the weakest bullet with a verb, metric, and outcome.",
      targetSection: builderSection(8, "Work Experience Step"),
      estimatedScoreGain: weakExperienceBullets.length >= 2 ? 5 : 3,
      route: createRoute("/builder", 8),
    }),
  ];
}

function educationRecommendations(snapshot: RecommendationAnalysisInput): RoadmapItem[] {
  if (snapshot.educationStatus === "No education section detected") {
    return [
      createRecommendation({
        id: "education-add",
        category: "Education",
        severity: "Medium",
        title: "Add an education entry",
        description: "Your resume does not include an education section yet.",
        whyItMatters: "Education can strengthen credibility, especially for early-career candidates or role changes.",
        howToFix: "Open Builder → Education Step and add your school, degree, and dates.",
        targetSection: builderSection(9, "Education Step"),
        estimatedScoreGain: 3,
        route: createRoute("/builder", 9),
      }),
    ];
  }

  if (!snapshot.educationStatus.includes("older")) return [];

  return [
    createRecommendation({
      id: "education-dates",
      category: "Education",
      severity: "Low",
      title: "Simplify older education dates",
      description: "Your education dates may be older than needed for modern ATS and recruiter review.",
      whyItMatters:
        "Removing older dates can reduce age-bias risk and keeps the resume focused on more recent experience.",
      howToFix: "Open Builder → Education Step and remove graduation dates if they are no longer strategically useful.",
      targetSection: builderSection(9, "Education Step"),
      estimatedScoreGain: 2,
      route: createRoute("/builder", 9),
    }),
  ];
}

function achievementRecommendations(snapshot: RecommendationAnalysisInput): RoadmapItem[] {
  if (snapshot.achievementsCount > 0 || snapshot.certificatesCount > 0) return [];

  return [
    createRecommendation({
      id: "achievements-proof",
      category: "Achievements",
      severity: "Medium",
      title: "Add proof of achievement",
      description: "Your resume has no achievements or certificates section yet.",
      whyItMatters: "Awards, certifications, and recognitions help validate your credibility and differentiate you from similar candidates.",
      howToFix: "Open Builder → Achievements Step and add any relevant awards, recognition, or certifications.",
      targetSection: builderSection(10, "Achievements Step"),
      estimatedScoreGain: 3,
      route: createRoute("/builder", 10),
    }),
  ];
}

function atsRecommendations(snapshot: RecommendationAnalysisInput): RoadmapItem[] {
  const keywordScore = snapshot.keywordCoverage.score;
  const weakSummary = snapshot.summaryQuality.score < 85;
  const lowReadability = snapshot.readability.score < 80;

  if (keywordScore >= 85 && !weakSummary && !lowReadability) return [];

  const details: string[] = [];
  if (keywordScore < 85) {
    details.push(`Keyword coverage is only ${keywordScore}%.`);
  }
  if (weakSummary) {
    details.push("The summary still needs stronger role-aligned phrasing.");
  }
  if (lowReadability) {
    details.push("Bullet density and phrasing could be easier for ATS parsing.");
  }

  return [
    createRecommendation({
      id: "ats-close-gaps",
      category: "ATS",
      severity: keywordScore < 70 ? "High" : "Medium",
      title: "Close ATS keyword gaps",
      description: details.join(" "),
      whyItMatters:
        "ATS systems rank resumes using keyword matches, structure, and concise phrasing before a human ever sees them.",
      howToFix: "Open Builder → Skills Step and Summary Step to align language with the target role without stuffing keywords.",
      targetSection: builderSection(6, "Skills Step"),
      estimatedScoreGain: keywordScore < 70 ? 6 : 4,
      route: createRoute("/builder", 6),
    }),
  ];
}

function formattingRecommendations(snapshot: RecommendationAnalysisInput): RoadmapItem[] {
  const formattingScore = Math.round(
    snapshot.formattingMetrics.reduce((sum, metric) => sum + metric.score, 0) / Math.max(1, snapshot.formattingMetrics.length)
  );

  if (formattingScore >= 90) return [];

  return [
    createRecommendation({
      id: "formatting-cleanup",
      category: "Formatting",
      severity: formattingScore < 75 ? "Medium" : "Low",
      title: "Tighten formatting consistency",
      description: "Spacing and layout settings still leave some room for cleaner ATS-safe presentation.",
      whyItMatters:
        "Formatting affects scanability, readability, and whether older ATS systems can parse your document cleanly.",
      howToFix: "Open Studio and adjust margins, line height, or template settings to keep the layout compact and readable.",
      targetSection: studioSection("Layout Settings"),
      estimatedScoreGain: formattingScore < 75 ? 4 : 2,
      route: createRoute("/studio", undefined, "layout"),
    }),
  ];
}

export interface RecommendationBundle {
  recommendations: RoadmapItem[];
  recommendationGroups: RecommendationGroup[];
  currentScore: number;
  potentialScore: number;
  estimatedImprovement: number;
}

export interface RecommendationAnalysisInput {
  overallScore: number;
  summaryQuality: SummaryQuality;
  readability: ReadabilityMetrics;
  keywordCoverage: KeywordCoverage;
  contactChecks: ContactCheck[];
  skillsCount: number;
  projectCount: number;
  experienceCount: number;
  educationStatus: string;
  certificatesCount: number;
  achievementsCount: number;
  formattingMetrics: FormattingMetric[];
  weakBullets: WeakBulletSuggestion[];
}

export function buildRecommendationBundle(snapshot: RecommendationAnalysisInput, builder: BuilderState, resume: ResumeData): RecommendationBundle {
  const recommendations = [
    ...contactRecommendations(snapshot),
    ...structureRecommendations(snapshot, builder),
    ...skillsRecommendations(snapshot),
    ...projectRecommendations(snapshot, resume),
    ...experienceRecommendations(snapshot, resume),
    ...educationRecommendations(snapshot),
    ...achievementRecommendations(snapshot),
    ...atsRecommendations(snapshot),
    ...formattingRecommendations(snapshot),
  ].sort((left, right) => severityRank(left.severity) - severityRank(right.severity) || right.estimatedScoreGain - left.estimatedScoreGain);

  const recommendationGroups = CATEGORY_ORDER.map((category) => ({
    category,
    recommendations: recommendations.filter((recommendation) => recommendation.category === category),
  })).filter((group) => group.recommendations.length > 0);

  const currentScore = snapshot.overallScore;
  const potentialScore = clamp(
    currentScore + recommendations.reduce((sum, recommendation) => sum + recommendation.estimatedScoreGain, 0)
  );
  const estimatedImprovement = potentialScore - currentScore;

  return { recommendations, recommendationGroups, currentScore, potentialScore, estimatedImprovement };
}
