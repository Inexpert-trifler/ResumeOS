import { getApiBaseUrl } from "./api";

export interface GitHubAnalysisReport {
  profileScore: number;
  repositoryScore: number;
  readmeScore: number;
  documentationScore: number;
  overallScore: number;
  recommendations: string[];
  strengths: string[];
  weaknesses: string[];
}

export interface GitHubAnalysisResponse {
  success: boolean;
  data: {
    username: string;
    profileData?: Record<string, unknown>;
    repos: Array<{ name: string; description?: string; stars?: number; language?: string }>;
    analysis: GitHubAnalysisReport;
  };
}

export class GitHubService {
  private static tokenProvider: (() => Promise<string | null>) | null = null;
  private static readonly apiUrl = getApiBaseUrl();

  static configureTokenProvider(provider: (() => Promise<string | null>) | null) {
    this.tokenProvider = provider;
  }

  private static async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const token = await this.tokenProvider?.();
    if (!token) throw new Error("Authentication required for GitHub Optimizer.");

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
      const errorMsg = body?.error || `GitHub analysis failed (${response.status})`;
      throw new Error(errorMsg);
    }

    return body as T;
  }

  static async analyze(username: string): Promise<GitHubAnalysisResponse["data"]> {
    const res = await this.request<GitHubAnalysisResponse>("/github/analyze", {
      method: "POST",
      body: JSON.stringify({ username }),
    });
    return res.data;
  }
}
