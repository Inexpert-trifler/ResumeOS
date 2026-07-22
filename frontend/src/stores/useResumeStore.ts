import { create } from 'zustand';
import type { ResumeData, StudioSettings } from '@/types';

interface ResumeStoreState {
  resumeData: ResumeData | null;
  settings: StudioSettings | null;
  isDirty: boolean;
  isSaving: boolean;
  setResumeData: (data: ResumeData) => void;
  setSettings: (settings: Partial<StudioSettings>) => void;
  markDirty: (dirty: boolean) => void;
  setIsSaving: (saving: boolean) => void;
  clearResume: () => void;
}

export const useResumeStore = create<ResumeStoreState>((set) => ({
  resumeData: null,
  settings: null,
  isDirty: false,
  isSaving: false,
  setResumeData: (data) => set({ resumeData: data, isDirty: true }),
  setSettings: (settings) =>
    set((state) => ({
      settings: state.settings ? { ...state.settings, ...settings } : (settings as StudioSettings),
    })),
  markDirty: (dirty) => set({ isDirty: dirty }),
  setIsSaving: (saving) => set({ isSaving: saving }),
  clearResume: () => set({ resumeData: null, settings: null, isDirty: false, isSaving: false }),
}));
