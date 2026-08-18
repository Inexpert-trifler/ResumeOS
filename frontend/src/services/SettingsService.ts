import { getApiBaseUrl } from "./api";

export interface UserSettingsData {
  theme: string;
  defaultTemplate: string;
  defaultFont: string;
  accentColor: string;
}

export interface UserProfileData {
  id: string;
  email: string;
  name: string;
  avatarUrl: string;
}

export class SettingsService {
  private static tokenProvider: (() => Promise<string | null>) | null = null;
  private static readonly apiUrl = getApiBaseUrl();

  static configureTokenProvider(provider: (() => Promise<string | null>) | null) {
    this.tokenProvider = provider;
  }

  private static async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const token = await this.tokenProvider?.();
    if (!token) throw new Error("Authentication required for Settings.");

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
      const errorMsg = body?.error || `Settings request failed (${response.status})`;
      throw new Error(errorMsg);
    }

    return body as T;
  }

  static async getSettings(): Promise<{ user: UserProfileData; settings: UserSettingsData }> {
    const res = await this.request<{
      success: boolean;
      data: { user: UserProfileData; settings: UserSettingsData };
    }>("/settings");
    return res.data;
  }

  static async updateSettings(patch: Partial<UserSettingsData>): Promise<UserSettingsData> {
    const res = await this.request<{ success: boolean; data: UserSettingsData }>("/settings", {
      method: "PATCH",
      body: JSON.stringify(patch),
    });
    return res.data;
  }
}
