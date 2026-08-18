import { getApiBaseUrl } from "./api";

export interface DashboardStatsData {
  totalResumes: number;
  totalJobsTracked: number;
  totalCoverLetters: number;
  totalInterviews: number;
  totalRoadmaps: number;
  avgAtsScore: number;
}

export interface DashboardResponse {
  success: boolean;
  stats: DashboardStatsData;
  recentResumes: Array<{
    id: string;
    title: string;
    updatedAt: string;
    template: string;
  }>;
  recentJobs: Array<{
    id: string;
    jobTitle: string;
    company: string;
    status: string;
  }>;
}

export class DashboardService {
  private static tokenProvider: (() => Promise<string | null>) | null = null;
  private static readonly apiUrl = getApiBaseUrl();

  static configureTokenProvider(provider: (() => Promise<string | null>) | null) {
    this.tokenProvider = provider;
  }

  private static async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const token = await this.tokenProvider?.();
    if (!token) throw new Error("Authentication required for Dashboard.");

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
      const errorMsg = body?.error || `Dashboard request failed (${response.status})`;
      throw new Error(errorMsg);
    }

    return body as T;
  }

  static async getStats(): Promise<DashboardResponse> {
    return this.request<DashboardResponse>("/dashboard/stats");
  }
}
