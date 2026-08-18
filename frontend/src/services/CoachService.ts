export interface CoachMessage {
  id: string;
  conversationId: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

export interface CoachConversation {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages?: CoachMessage[];
}

export interface SendMessageResponse {
  success: boolean;
  data: {
    userMessage: CoachMessage;
    assistantMessage: CoachMessage;
    suggestions: string[];
    actions?: Array<{ type: string; label: string }>;
  };
}

export class CoachService {
  private static tokenProvider: (() => Promise<string | null>) | null = null;
  private static readonly apiUrl = (
    process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api"
  ).replace(/\/$/, "");

  static configureTokenProvider(provider: (() => Promise<string | null>) | null) {
    this.tokenProvider = provider;
  }

  private static async request<T>(path: string, init: RequestInit = {}, suppliedToken?: string): Promise<T> {
    const token = suppliedToken ?? (await this.tokenProvider?.());
    if (!token) throw new Error("Authentication required to access AI Coach.");

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
      const errorMsg = body?.error?.message || body?.error || `Coach request failed (${response.status})`;
      throw new Error(errorMsg);
    }

    return body as T;
  }

  static async listConversations(): Promise<CoachConversation[]> {
    const res = await this.request<{ success: boolean; data: CoachConversation[] }>("/coach/conversations");
    return res.data;
  }

  static async createConversation(title?: string): Promise<CoachConversation> {
    const res = await this.request<{ success: boolean; data: CoachConversation }>("/coach/conversations", {
      method: "POST",
      body: JSON.stringify({ title }),
    });
    return res.data;
  }

  static async getConversation(id: string): Promise<CoachConversation> {
    const res = await this.request<{ success: boolean; data: CoachConversation }>(`/coach/conversations/${id}`);
    return res.data;
  }

  static async sendMessage(
    conversationId: string,
    content: string,
    targetRole?: string,
    jobDescription?: string
  ): Promise<SendMessageResponse["data"]> {
    const res = await this.request<SendMessageResponse>(`/coach/conversations/${conversationId}/messages`, {
      method: "POST",
      body: JSON.stringify({ content, targetRole, jobDescription }),
    });
    return res.data;
  }

  static async deleteConversation(id: string): Promise<void> {
    await this.request<{ success: boolean }>(`/coach/conversations/${id}`, {
      method: "DELETE",
    });
  }
}
