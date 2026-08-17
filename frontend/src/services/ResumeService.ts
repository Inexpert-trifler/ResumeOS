export interface CloudResume {
  id: string;
  title: string;
  resumeJson: Record<string, unknown>;
  selectedTemplate: string;
  updatedAt: string;
  createdAt: string;
}

export interface ResumeUpsertPayload {
  title: string;
  resumeJson: Record<string, unknown>;
  selectedTemplate: string;
}

export class ResumeService {
  private static tokenProvider: (() => Promise<string | null>) | null = null;
  private static readonly apiUrl = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api").replace(/\/$/, "");

  static configureTokenProvider(provider: (() => Promise<string | null>) | null) {
    this.tokenProvider = provider;
  }

  private static async request<T>(path: string, init: RequestInit = {}, suppliedToken?: string): Promise<T> {
    const token = suppliedToken ?? await this.tokenProvider?.();
    if (!token) throw new Error("Authentication is required to access cloud resumes.");
    const response = await fetch(`${this.apiUrl}${path}`, {
      ...init,
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", ...init.headers },
    });
    if (!response.ok) {
      const body = await response.json().catch(() => null) as { error?: string } | null;
      throw new Error(body?.error ?? `Cloud request failed (${response.status})`);
    }
    if (response.status === 204) return undefined as T;
    return response.json() as Promise<T>;
  }

  static async getResumes(token?: string): Promise<CloudResume[]> {
    const response = await this.request<{ data: CloudResume[] }>("/resumes", {}, token);
    return response.data;
  }

  static async getResumeById(id: string, token?: string): Promise<CloudResume> {
    return (await this.request<{ data: CloudResume }>(`/resumes/${id}`, {}, token)).data;
  }

  static async createResume(data: ResumeUpsertPayload, token?: string): Promise<CloudResume> {
    return (await this.request<{ data: CloudResume }>("/resumes", { method: "POST", body: JSON.stringify(data) }, token)).data;
  }

  static async updateResume(id: string, data: Partial<ResumeUpsertPayload>, token?: string): Promise<CloudResume> {
    return (await this.request<{ data: CloudResume }>(`/resumes/${id}`, { method: "PATCH", body: JSON.stringify(data) }, token)).data;
  }

  static async deleteResume(id: string, token?: string): Promise<void> {
    await this.request<void>(`/resumes/${id}`, { method: "DELETE" }, token);
  }
}
