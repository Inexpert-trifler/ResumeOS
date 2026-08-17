import { create } from 'zustand';
import type { AtsAnalysis } from '@/types';

interface AnalyzerStoreState {
  analysis: AtsAnalysis | null;
  isAnalyzing: boolean;
  uploadedFileName: string | null;
  jobDescription: string;
  setAnalysis: (analysis: AtsAnalysis) => void;
  setIsAnalyzing: (analyzing: boolean) => void;
  setUploadedFileName: (name: string | null) => void;
  setJobDescription: (jd: string) => void;
  clearAnalysis: () => void;
}

export const useAnalyzerStore = create<AnalyzerStoreState>((set) => ({
  analysis: null,
  isAnalyzing: false,
  uploadedFileName: null,
  jobDescription: '',
  setAnalysis: (analysis) => set({ analysis }),
  setIsAnalyzing: (analyzing) => set({ isAnalyzing: analyzing }),
  setUploadedFileName: (name) => set({ uploadedFileName: name }),
  setJobDescription: (jd) => set({ jobDescription: jd }),
  clearAnalysis: () => set({ analysis: null, isAnalyzing: false, uploadedFileName: null }),
}));
