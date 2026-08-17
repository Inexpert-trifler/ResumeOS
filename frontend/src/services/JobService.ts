import type {
  JobDescription,
  JobCreatePayload,
  JobUpdatePayload,
  JobKeyword,
  JobAnalysis,
  ParsedJobData,
} from "@/types";

export interface JobAnalyzeResponse {
  parsed: ParsedJobData;
  keywords: JobKeyword[];
  analysis: JobAnalysis;
}

export class JobService {
  private static tokenProvider: (() => Promise<string | null>) | null = null;
  private static readonly apiUrl = (
    process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api"
  ).replace(/\/$/, "");

  static configureTokenProvider(provider: (() => Promise<string | null>) | null) {
    this.tokenProvider = provider;
  }

  private static async request<T>(
    path: string,
    init: RequestInit = {},
    suppliedToken?: string,
  ): Promise<T> {
    const token = suppliedToken ?? (await this.tokenProvider?.());
    if (!token) throw new Error("Authentication required to access jobs.");
    const response = await fetch(`${this.apiUrl}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...init.headers,
      },
    });
    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as { error?: string } | null;
      throw new Error(body?.error ?? `Request failed (${response.status})`);
    }
    if (response.status === 204) return undefined as T;
    return response.json() as Promise<T>;
  }

  // ─── CRUD ──────────────────────────────────────────────────────────────────

  static async getJobs(token?: string): Promise<JobDescription[]> {
    const res = await this.request<{ data: JobDescription[] }>("/jobs", {}, token);
    return res.data;
  }

  static async getJobById(id: string, token?: string): Promise<JobDescription> {
    const res = await this.request<{ data: JobDescription }>(`/jobs/${id}`, {}, token);
    return res.data;
  }

  static async createJob(data: JobCreatePayload, token?: string): Promise<JobDescription> {
    const res = await this.request<{ data: JobDescription }>(
      "/jobs",
      { method: "POST", body: JSON.stringify(data) },
      token,
    );
    return res.data;
  }

  static async updateJob(
    id: string,
    data: JobUpdatePayload,
    token?: string,
  ): Promise<JobDescription> {
    const res = await this.request<{ data: JobDescription }>(
      `/jobs/${id}`,
      { method: "PATCH", body: JSON.stringify(data) },
      token,
    );
    return res.data;
  }

  static async deleteJob(id: string, token?: string): Promise<void> {
    await this.request<void>(`/jobs/${id}`, { method: "DELETE" }, token);
  }

  // ─── Analysis ──────────────────────────────────────────────────────────────

  static async analyzeJob(id: string, token?: string): Promise<JobAnalyzeResponse> {
    const res = await this.request<{ data: JobAnalyzeResponse }>(
      `/jobs/${id}/analyze`,
      { method: "POST" },
      token,
    );
    return res.data;
  }

  // ─── Resume linking ─────────────────────────────────────────────────────────

  static async linkResume(jobId: string, resumeId: string, token?: string): Promise<void> {
    await this.request<void>(
      `/jobs/${jobId}/link-resume`,
      { method: "POST", body: JSON.stringify({ resumeId }) },
      token,
    );
  }

  static async unlinkResume(jobId: string, resumeId: string, token?: string): Promise<void> {
    await this.request<void>(
      `/jobs/${jobId}/link-resume/${resumeId}`,
      { method: "DELETE" },
      token,
    );
  }
}
