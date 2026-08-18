import { getApiBaseUrl } from "./api";

export interface ScoreBreakdown {
  skills: number;
  keywords: number;
  experience: number;
  responsibilities: number;
  education: number;
  softSkills: number;
}

export interface MissingKeywordItem {
  keyword: string;
  importance: "high" | "medium" | "low";
  reason: string;
}

export interface MatchedKeywordItem {
  keyword: string;
  resumeSections: string[];
}

export interface AtsAnalysisResponse {
  success: boolean;
  analysisId?: string | null;
  overallScore: number;
  atsScore: number;
  breakdown: ScoreBreakdown;
  matchedSkills: string[];
  missingSkills: string[];
  matchedKeywords: MatchedKeywordItem[];
  missingKeywords: MissingKeywordItem[];
  recommendations: string[];
  strengths: string[];
  weaknesses: string[];
  jobTitleMatch: boolean;
  seniorityMatch: boolean;
  aiSummary?: string;
  resumeHealth: ResumeHealthReport;
}

export interface ResumeHealthReport {
  score: number;
  contentScore: number;
  actionVerbsScore: number;
  contactScore: number;
  structureScore: number;
  scoreCards: Array<{ id: string; title: string; score: number; status: string; description: string; icon: string; color: string }>;
  formattingMetrics: Array<{ name: string; score: number; status: string; icon: string }>;
  sectionAnalysis: Array<{ id: string; name: string; score: number; strengths: string[]; weaknesses: string[]; suggestions: string[] }>;
  weakBullets: Array<{ id: string; original: string; suggestion: string; score: number; section: string }>;
  atsSimulation: Array<{ id: string; state: "pass" | "warn"; message: string }>;
}

export class AnalysisService {
  private static tokenProvider: (() => Promise<string | null>) | null = null;
  private static readonly apiUrl = getApiBaseUrl();

  static configureTokenProvider(provider: (() => Promise<string | null>) | null) {
    this.tokenProvider = provider;
  }

  private static async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const token = await this.tokenProvider?.();
    if (!token) throw new Error("Authentication required to run ATS analysis.");

    const response = await fetch(`${this.apiUrl}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...init.headers,
      },
    });

    const body = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMsg = body?.error || `Analysis request failed (${response.status})`;
      throw new Error(errorMsg);
    }

    return body as T;
  }

  static async analyze(params: {
    resumeId?: string;
    jobId?: string;
    jobDescription?: string;
    targetRole?: string;
  }): Promise<AtsAnalysisResponse> {
    return this.request<AtsAnalysisResponse>("/analysis", {
      method: "POST",
      body: JSON.stringify(params),
    });
  }
}
