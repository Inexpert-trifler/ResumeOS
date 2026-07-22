import { create } from 'zustand';
import type { JobApplication } from '@/types';

interface TrackerStoreState {
  jobs: JobApplication[];
  isLoading: boolean;
  filterStatus: string | null;
  addJob: (job: JobApplication) => void;
  updateJob: (id: string, updates: Partial<JobApplication>) => void;
  removeJob: (id: string) => void;
  setFilterStatus: (status: string | null) => void;
  setIsLoading: (loading: boolean) => void;
}

export const useTrackerStore = create<TrackerStoreState>((set) => ({
  jobs: [],
  isLoading: false,
  filterStatus: null,
  addJob: (job) => set((state) => ({ jobs: [...state.jobs, job] })),
  updateJob: (id, updates) =>
    set((state) => ({
      jobs: state.jobs.map((job) => (job.id === id ? { ...job, ...updates } : job)),
    })),
  removeJob: (id) => set((state) => ({ jobs: state.jobs.filter((job) => job.id !== id) })),
  setFilterStatus: (status) => set({ filterStatus: status }),
  setIsLoading: (loading) => set({ isLoading: loading }),
}));
