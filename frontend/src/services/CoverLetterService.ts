import { getApiBaseUrl } from "./api";

export interface CoverLetterRecord {
  id: string;
  userId: string;
  resumeId: string;
  jobId: string;
  title: string;
  content: string;
  tone: string;
  createdAt: string;
  updatedAt: string;
  subject?: string;
  personalizationPoints?: string[];
  warnings?: string[];
}

export interface GenerateCoverLetterPayload {
  resumeId?: string;
  jobId?: string;
  company: string;
  role?: string;
  jobTitle?: string;
  jobDescription?: string;
  tone?: string;
  instructions?: string;
}

export class CoverLetterService {
  private static tokenProvider: (() => Promise<string | null>) | null = null;
  private static readonly apiUrl = getApiBaseUrl();

  static configureTokenProvider(provider: (() => Promise<string | null>) | null) {
    this.tokenProvider = provider;
  }

  private static async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const token = await this.tokenProvider?.();
    if (!token) throw new Error("Authentication required to access Cover Letter features.");

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
      const errorMsg = body?.error?.message || body?.error || `Cover letter request failed (${response.status})`;
      throw new Error(errorMsg);
    }

    return body as T;
  }

  static async generate(payload: GenerateCoverLetterPayload): Promise<CoverLetterRecord> {
    const res = await this.request<{ success: boolean; data: CoverLetterRecord }>("/cover-letters", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return res.data;
  }

  static async list(): Promise<CoverLetterRecord[]> {
    const res = await this.request<{ success: boolean; data: CoverLetterRecord[] }>("/cover-letters");
    return res.data;
  }

  static async get(id: string): Promise<CoverLetterRecord> {
    const res = await this.request<{ success: boolean; data: CoverLetterRecord }>(`/cover-letters/${id}`);
    return res.data;
  }

  static async update(id: string, content: string): Promise<CoverLetterRecord> {
    const res = await this.request<{ success: boolean; data: CoverLetterRecord }>(`/cover-letters/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ content }),
    });
    return res.data;
  }

  static async delete(id: string): Promise<void> {
    await this.request<{ success: boolean }>(`/cover-letters/${id}`, {
      method: "DELETE",
    });
  }
}
