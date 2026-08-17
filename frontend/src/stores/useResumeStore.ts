import { create } from 'zustand';
import type { ResumeData, StudioSettings } from '@/types';

interface ResumeStoreState {
  resumeData: ResumeData | null;
  settings: StudioSettings | null;
  isDirty: boolean;
  isSaving: boolean;
  cloudResumeId: string | null;
  syncStatus: "idle" | "syncing" | "offline" | "error";
  syncError: string | null;
  lastSyncedAt: string | null;
  setResumeData: (data: ResumeData) => void;
  setSettings: (settings: Partial<StudioSettings>) => void;
  markDirty: (dirty: boolean) => void;
  setIsSaving: (saving: boolean) => void;
  setCloudSyncState: (state: Partial<Pick<ResumeStoreState, "cloudResumeId" | "syncStatus" | "syncError" | "lastSyncedAt">>) => void;
  clearResume: () => void;
}

export const useResumeStore = create<ResumeStoreState>((set) => ({
  resumeData: null,
  settings: null,
  isDirty: false,
  isSaving: false,
  cloudResumeId: null,
  syncStatus: "idle",
  syncError: null,
  lastSyncedAt: null,
  setResumeData: (data) => set({ resumeData: data, isDirty: true }),
  setSettings: (settings) =>
    set((state) => ({
      settings: state.settings ? { ...state.settings, ...settings } : (settings as StudioSettings),
    })),
  markDirty: (dirty) => set({ isDirty: dirty }),
  setIsSaving: (saving) => set({ isSaving: saving }),
  setCloudSyncState: (state) => set(state),
  clearResume: () => set({ resumeData: null, settings: null, isDirty: false, isSaving: false, cloudResumeId: null, syncStatus: "idle", syncError: null, lastSyncedAt: null }),
}));
