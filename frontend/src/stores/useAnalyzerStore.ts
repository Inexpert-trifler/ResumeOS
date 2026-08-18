import { create } from "zustand";
import { AnalysisService, type AtsAnalysisResponse } from "@/services/AnalysisService";

interface AnalyzerStoreState {
  jobDescription: string;
  targetRole: string;
  analysis: AtsAnalysisResponse | null;
  isAnalyzing: boolean;
  error: string | null;

  setJobDescription: (jd: string) => void;
  setTargetRole: (role: string) => void;

  runAnalysis: (params?: { jobDescription?: string; targetRole?: string; resumeId?: string; jobId?: string }) => Promise<AtsAnalysisResponse | null>;
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
    const jd = params?.jobDescription ?? get().jobDescription;
    const role = params?.targetRole ?? get().targetRole;

    // Never leave a prior job's scores visible while a new analysis is running.
    set({ analysis: null, isAnalyzing: true, error: null });
    try {
      const report = await AnalysisService.analyze({
        jobDescription: jd,
        targetRole: role,
        resumeId: params?.resumeId,
        jobId: params?.jobId,
      });

      set({ analysis: report, isAnalyzing: false });
      return report;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to run ATS analysis.";
      set({ error: message, isAnalyzing: false });
      return null;
    }
  },
}));
