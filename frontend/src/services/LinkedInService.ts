import { getApiBaseUrl } from "./api";

export interface LinkedInAnalysisReport {
  overallScore: number;
  headlineScore: number;
  aboutScore: number;
  experienceScore: number;
  skillsScore: number;
  recommendations: string[];
  rewrittenHeadline: string;
  rewrittenAbout: string;
}

export class LinkedInService {
  private static tokenProvider: (() => Promise<string | null>) | null = null;
  private static readonly apiUrl = getApiBaseUrl();

  static configureTokenProvider(provider: (() => Promise<string | null>) | null) {
    this.tokenProvider = provider;
  }

  private static async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const token = await this.tokenProvider?.();
    if (!token) throw new Error("Authentication required for LinkedIn Optimizer.");

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
      const errorMsg = body?.error || `LinkedIn analysis failed (${response.status})`;
      throw new Error(errorMsg);
    }

    return body as T;
  }

  static async analyze(payload: {
    headline?: string;
    about?: string;
    experience?: string;
    skills?: string;
    targetRole?: string;
  }): Promise<LinkedInAnalysisReport> {
    const res = await this.request<{ success: boolean; data: LinkedInAnalysisReport }>("/linkedin/analyze", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return res.data;
  }
}
