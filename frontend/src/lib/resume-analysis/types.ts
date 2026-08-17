export type AnalysisStatus = "excellent" | "good" | "needs-work" | "perfect";
export type AnalysisSeverity = "Critical" | "High" | "Medium" | "Low";
export type RecommendationCategory =
  | "Contact Information"
  | "Resume Structure"
  | "Skills"
  | "Projects"
  | "Experience"
  | "Education"
  | "Achievements"
  | "ATS"
  | "Formatting";
export type CheckState = "pass" | "warn" | "info";

export interface RecommendationRoute {
  pathname: "/builder" | "/studio";
  step?: number;
  hash?: string;
}

export interface AnalysisScoreCard {
  id: string;
  title: string;
  score: number;
  status: string;
  description: string;
  icon: string;
  color: string;
}

export interface AnalysisSectionItem {
  id: string;
  name: string;
  score: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

export interface KeywordCoverage {
  matched: string[];
  missing: string[];
  recommended: string[];
  score: number;
}

export interface FormattingMetric {
  name: string;
  score: number;
  status: string;
  icon: string;
}

export interface WeakBulletSuggestion {
  id: string;
  original: string;
  suggestion: string;
  score: number;
  section: string;
}

export interface RoadmapItem {
  id: string;
  category: RecommendationCategory;
  severity: AnalysisSeverity;
  title: string;
  description: string;
  whyItMatters: string;
  howToFix: string;
  targetSection: string;
  estimatedScoreGain: number;
  route: RecommendationRoute;
  estimatedImpact: string;
}

export interface RecommendationGroup {
  category: RecommendationCategory;
  recommendations: RoadmapItem[];
}

export interface AtsSimulationLine {
  id: string;
  state: CheckState;
  message: string;
}

export interface ContactCheck {
  label: string;
  value: string;
  state: CheckState;
  note: string;
}

export interface SummaryQuality {
  score: number;
  length: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

export interface ReadabilityMetrics {
  score: number;
  averageWordsPerBullet: number;
  averageWordsPerExperienceBullet: number;
  averageSummaryWords: number;
  quantifiedBullets: number;
  metricDensity: number;
}

export interface AnalysisSnapshot {
  overallScore: number;
  currentScore: number;
  potentialScore: number;
  estimatedImprovement: number;
  resumeCompleteness: number;
  sectionCompletion: number;
  atsReadiness: number;
  grammarScore: number;
  experienceScore: number;
  skillsScore: number;
  impactScore: number;
  contactChecks: ContactCheck[];
  skillsCount: number;
  projectCount: number;
  experienceCount: number;
  educationStatus: string;
  certificatesCount: number;
  achievementsCount: number;
  languagesCount: number;
  summaryQuality: SummaryQuality;
  readability: ReadabilityMetrics;
  keywordCoverage: KeywordCoverage;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  scoreCards: AnalysisScoreCard[];
  formattingMetrics: FormattingMetric[];
  sectionAnalysis: AnalysisSectionItem[];
  weakBullets: WeakBulletSuggestion[];
  roadmap: RoadmapItem[];
  recommendations: RoadmapItem[];
  recommendationGroups: RecommendationGroup[];
  atsSimulation: AtsSimulationLine[];
  targetRole: string;
  targetCompany: string;
  verdict: string;
  verdictDescription: string;
  verdictProgress: number;
  proTipTitle: string;
  proTip: string;
  factTitle: string;
  fact: string;
  lastSavedLabel: string;
  heroStatus: string;
  heroDescription: string;
}
