import { getApiBaseUrl } from "./api";

export interface InterviewSessionRecord {
  id: string;
  userId: string;
  resumeId: string;
  jobId: string;
  createdAt: string;
}

export interface InterviewQuestionItem {
  id: string;
  sessionId: string;
  category: string;
  question: string;
  difficulty: string;
  whyItMayBeAsked: string;
  suggestedAnswer: string;
  keyPoints: string[];
  answer?: {
    id: string;
    answerText: string;
    feedback?: string | null;
    score?: number | null;
  } | null;
}

export interface EvaluationItem {
  questionId: string;
  question: string;
  category: string;
  score: number;
  feedback: string;
  strengths: string[];
  weaknesses: string[];
  improvedAnswer: string;
  star: {
    situation: boolean;
    task: boolean;
    action: boolean;
    result: boolean;
  };
  communication: number;
  technicalAccuracy: number;
  relevance: number;
  structure: number;
}

export interface EvaluateSessionResponse {
  success: boolean;
  overallScore: number;
  totalQuestions: number;
  answeredQuestions: number;
  evaluations: EvaluationItem[];
}

export class InterviewService {
  private static tokenProvider: (() => Promise<string | null>) | null = null;
  private static readonly apiUrl = getApiBaseUrl();

  static configureTokenProvider(provider: (() => Promise<string | null>) | null) {
    this.tokenProvider = provider;
  }

  private static async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const token = await this.tokenProvider?.();
    if (!token) throw new Error("Authentication required for Interview Prep.");

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
      const errorMsg = body?.error || `Interview service request failed (${response.status})`;
      throw new Error(errorMsg);
    }

    return body as T;
  }

  static async createSession(payload: {
    resumeId?: string;
    jobId?: string;
    targetRole?: string;
    interviewType?: string;
    difficulty?: string;
  }): Promise<InterviewSessionRecord> {
    const res = await this.request<{ success: boolean; data: InterviewSessionRecord }>("/interviews/sessions", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return res.data;
  }

  static async generateQuestions(sessionId: string, params: {
    targetRole?: string;
    interviewType?: string;
    difficulty?: string;
    count?: number;
  }): Promise<InterviewQuestionItem[]> {
    const res = await this.request<{ success: boolean; data: InterviewQuestionItem[] }>(`/interviews/sessions/${sessionId}/questions`, {
      method: "POST",
      body: JSON.stringify(params),
    });
    return res.data;
  }

  static async submitAnswer(sessionId: string, questionId: string, answerText: string): Promise<void> {
    await this.request<{ success: boolean }>(`/interviews/sessions/${sessionId}/answers`, {
      method: "POST",
      body: JSON.stringify({ questionId, answerText }),
    });
  }

  static async evaluateSession(sessionId: string): Promise<EvaluateSessionResponse> {
    return this.request<EvaluateSessionResponse>(`/interviews/sessions/${sessionId}/evaluate`, {
      method: "POST",
    });
  }

  static async getSession(id: string): Promise<{
    session: InterviewSessionRecord;
    questions: InterviewQuestionItem[];
  }> {
    const res = await this.request<{
      success: boolean;
      data: { session: InterviewSessionRecord; questions: InterviewQuestionItem[] };
    }>(`/interviews/sessions/${id}`);
    return res.data;
  }

  static async listSessions(): Promise<InterviewSessionRecord[]> {
    const res = await this.request<{ success: boolean; data: InterviewSessionRecord[] }>("/interviews/sessions");
    return res.data;
  }
}
