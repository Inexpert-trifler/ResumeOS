import { create } from "zustand";
import { InterviewService, type InterviewSessionRecord, type InterviewQuestionItem, type EvaluateSessionResponse } from "@/services/InterviewService";

interface InterviewStoreState {
  targetRole: string;
  interviewType: string;
  difficulty: string;

  activeSession: InterviewSessionRecord | null;
  questions: InterviewQuestionItem[];
  currentQuestionIndex: number;
  userAnswer: string;
  evaluationResult: EvaluateSessionResponse | null;

  isCreatingSession: boolean;
  isGeneratingQuestions: boolean;
  isSubmittingAnswer: boolean;
  isEvaluating: boolean;
  sessionsList: InterviewSessionRecord[];
  error: string | null;

  setTargetRole: (role: string) => void;
  setInterviewType: (type: string) => void;
  setDifficulty: (diff: string) => void;
  setUserAnswer: (text: string) => void;

  startNewInterview: (params?: { resumeId?: string; jobId?: string }) => Promise<void>;
  submitCurrentAnswer: () => Promise<void>;
  nextQuestion: () => void;
  prevQuestion: () => void;
  finishAndEvaluateSession: () => Promise<EvaluateSessionResponse | null>;
  fetchPastSessions: () => Promise<void>;
  loadSession: (sessionId: string) => Promise<void>;
}

export const useInterviewStore = create<InterviewStoreState>((set, get) => ({
  targetRole: "Software Engineer",
  interviewType: "mixed",
  difficulty: "intermediate",

  activeSession: null,
  questions: [],
  currentQuestionIndex: 0,
  userAnswer: "",
  evaluationResult: null,

  isCreatingSession: false,
  isGeneratingQuestions: false,
  isSubmittingAnswer: false,
  isEvaluating: false,
  sessionsList: [],
  error: null,

  setTargetRole: (targetRole) => set({ targetRole }),
  setInterviewType: (interviewType) => set({ interviewType }),
  setDifficulty: (difficulty) => set({ difficulty }),
  setUserAnswer: (userAnswer) => set({ userAnswer }),

  startNewInterview: async (params) => {
    const { targetRole, interviewType, difficulty } = get();
    set({ isCreatingSession: true, error: null, evaluationResult: null, questions: [], currentQuestionIndex: 0, userAnswer: "" });

    try {
      // 1. Create Session
      const session = await InterviewService.createSession({
        targetRole,
        interviewType,
        difficulty,
        resumeId: params?.resumeId,
        jobId: params?.jobId,
      });

      set({ activeSession: session, isCreatingSession: false, isGeneratingQuestions: true });

      // 2. Generate Questions
      const questionsList = await InterviewService.generateQuestions(session.id, {
        targetRole,
        interviewType,
        difficulty,
        count: 5,
      });

      set({ questions: questionsList, isGeneratingQuestions: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to start interview session.";
      set({ error: message, isCreatingSession: false, isGeneratingQuestions: false });
    }
  },

  submitCurrentAnswer: async () => {
    const { activeSession, questions, currentQuestionIndex, userAnswer } = get();
    if (!activeSession || questions.length === 0 || !userAnswer.trim()) return;

    const currentQ = questions[currentQuestionIndex];
    set({ isSubmittingAnswer: true, error: null });

    try {
      await InterviewService.submitAnswer(activeSession.id, currentQ.id, userAnswer.trim());

      // Update question answer locally
      const updatedQuestions = [...questions];
      updatedQuestions[currentQuestionIndex] = {
        ...currentQ,
        answer: {
          id: `ans-${currentQ.id}`,
          answerText: userAnswer.trim(),
        },
      };

      set({ questions: updatedQuestions, isSubmittingAnswer: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to submit answer.";
      set({ error: message, isSubmittingAnswer: false });
    }
  },

  nextQuestion: () => {
    const { questions, currentQuestionIndex, userAnswer, submitCurrentAnswer } = get();
    if (userAnswer.trim()) {
      void submitCurrentAnswer();
    }

    if (currentQuestionIndex < questions.length - 1) {
      const nextIdx = currentQuestionIndex + 1;
      const existingAns = questions[nextIdx]?.answer?.answerText || "";
      set({ currentQuestionIndex: nextIdx, userAnswer: existingAns });
    }
  },

  prevQuestion: () => {
    const { questions, currentQuestionIndex } = get();
    if (currentQuestionIndex > 0) {
      const prevIdx = currentQuestionIndex - 1;
      const existingAns = questions[prevIdx]?.answer?.answerText || "";
      set({ currentQuestionIndex: prevIdx, userAnswer: existingAns });
    }
  },

  finishAndEvaluateSession: async () => {
    const { activeSession, userAnswer, submitCurrentAnswer } = get();
    if (!activeSession) return null;

    if (userAnswer.trim()) {
      await submitCurrentAnswer();
    }

    set({ isEvaluating: true, error: null });
    try {
      const result = await InterviewService.evaluateSession(activeSession.id);
      set({ evaluationResult: result, isEvaluating: false });
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to evaluate session.";
      set({ error: message, isEvaluating: false });
      return null;
    }
  },

  fetchPastSessions: async () => {
    try {
      const list = await InterviewService.listSessions();
      set({ sessionsList: list });
    } catch (err) {
      console.warn("Failed to list past sessions:", err);
    }
  },

  loadSession: async (sessionId: string) => {
    set({ isCreatingSession: true, error: null });
    try {
      const { session, questions } = await InterviewService.getSession(sessionId);
      set({
        activeSession: session,
        questions,
        currentQuestionIndex: 0,
        userAnswer: questions[0]?.answer?.answerText || "",
        isCreatingSession: false,
      });

      // Run evaluation summary for existing session
      void get().finishAndEvaluateSession();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load session.";
      set({ error: message, isCreatingSession: false });
    }
  },
}));
