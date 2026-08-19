import { create } from "zustand";
import { AnalysisService, type AtsAnalysisResponse } from "@/services/AnalysisService";
import { readResumeDraft } from "@/lib/resume-draft";
import { useResumeStore } from "@/stores/useResumeStore";

interface AnalyzerStoreState {
  jobDescription: string;
  targetRole: string;
  analysis: AtsAnalysisResponse | null;
  isAnalyzing: boolean;
  error: string | null;

  setJobDescription: (jd: string) => void;
  setTargetRole: (role: string) => void;

  runAnalysis: (params?: {
    jobDescription?: string;
    targetRole?: string;
    resumeId?: string;
    jobId?: string;
    resume?: unknown;
  }) => Promise<AtsAnalysisResponse | null>;
}

export const useAnalyzerStore = create<AnalyzerStoreState>((set, get) => ({
  jobDescription: "",
  targetRole: "",
  analysis: null,
  isAnalyzing: false,
  error: null,

  setJobDescription: (jobDescription) => set({ jobDescription }),
  setTargetRole: (targetRole) => set({ targetRole }),

  runAnalysis: async (params) => {
    const jd = (params?.jobDescription ?? get().jobDescription).trim();
    const role = (params?.targetRole ?? get().targetRole).trim();

    if (!jd) {
      set({ error: "A job description is required for ATS job-match analysis.", isAnalyzing: false });
      return null;
    }

    // Retrieve active resume from local draft or store
    const localDraft = readResumeDraft();
    const storeResume = useResumeStore.getState().resumeData;
    const cloudResumeId = useResumeStore.getState().cloudResumeId;

    const clientResume = params?.resume ?? localDraft?.resume ?? localDraft ?? storeResume ?? null;
    const resumeId = params?.resumeId ?? cloudResumeId ?? undefined;

    // Never leave a prior job's scores visible while a new analysis is running.
    set({ analysis: null, isAnalyzing: true, error: null });
    try {
      const report = await AnalysisService.analyze({
        jobDescription: jd,
        targetRole: role,
        resumeId,
        jobId: params?.jobId,
        resume: clientResume,
      });

      set({ analysis: report, isAnalyzing: false, error: null });
      return report;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to run ATS analysis.";
      set({ error: message, isAnalyzing: false });
      return null;
    }
  },
}));
