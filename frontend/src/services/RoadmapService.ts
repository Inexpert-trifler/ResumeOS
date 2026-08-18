import { getApiBaseUrl } from "./api";

export interface CareerRoadmapItemRecord {
  id: string;
  roadmapId: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  estimatedTime: string;
  skills: string[];
  resources: Array<{ title: string; type?: string; academyReference?: string }>;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
  createdAt: string;
}

export interface CareerRoadmapRecord {
  id: string;
  userId: string;
  targetRole: string;
  createdAt: string;
}

export interface RoadmapDetailResponse {
  success: boolean;
  data: {
    roadmap: CareerRoadmapRecord;
    items: CareerRoadmapItemRecord[];
    progress: number;
  };
}

export class RoadmapService {
  private static tokenProvider: (() => Promise<string | null>) | null = null;
  private static readonly apiUrl = getApiBaseUrl();

  static configureTokenProvider(provider: (() => Promise<string | null>) | null) {
    this.tokenProvider = provider;
  }

  private static async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const token = await this.tokenProvider?.();
    if (!token) throw new Error("Authentication required for Career Roadmap.");

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
      const errorMsg = body?.error || `Roadmap service request failed (${response.status})`;
      throw new Error(errorMsg);
    }

    return body as T;
  }

  static async generate(payload: {
    targetRole?: string;
    targetCompany?: string;
    missingSkills?: string[];
  }): Promise<RoadmapDetailResponse["data"]> {
    const res = await this.request<RoadmapDetailResponse>("/roadmaps", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return res.data;
  }

  static async list(): Promise<CareerRoadmapRecord[]> {
    const res = await this.request<{ success: boolean; data: CareerRoadmapRecord[] }>("/roadmaps");
    return res.data;
  }

  static async get(id: string): Promise<RoadmapDetailResponse["data"]> {
    const res = await this.request<RoadmapDetailResponse>(`/roadmaps/${id}`);
    return res.data;
  }

  static async updateItemStatus(
    roadmapId: string,
    itemId: string,
    status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED"
  ): Promise<{ updatedItem: CareerRoadmapItemRecord; overallProgress: number }> {
    const res = await this.request<{
      success: boolean;
      data: CareerRoadmapItemRecord;
      overallProgress: number;
    }>(`/roadmaps/${roadmapId}/items/${itemId}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    return { updatedItem: res.data, overallProgress: res.overallProgress };
  }

  static async delete(id: string): Promise<void> {
    await this.request<{ success: boolean }>(`/roadmaps/${id}`, {
      method: "DELETE",
    });
  }
}
