import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { JobService } from '@/services';
import type {
  JobDescription,
  JobCreatePayload,
  JobUpdatePayload,
  JobAnalyzeResponse
} from '@/types';

interface JobState {
  jobs: JobDescription[];
  isLoading: boolean;
  error: string | null;
  lastFetchedAt: number | null;
  
  // Actions
  fetchJobs: (force?: boolean) => Promise<void>;
  getJobById: (id: string, force?: boolean) => Promise<JobDescription | null>;
  createJob: (payload: JobCreatePayload) => Promise<JobDescription>;
  updateJob: (id: string, payload: JobUpdatePayload) => Promise<JobDescription>;
  deleteJob: (id: string) => Promise<void>;
  analyzeJob: (id: string) => Promise<JobAnalyzeResponse>;
  linkResume: (jobId: string, resumeId: string) => Promise<void>;
  unlinkResume: (jobId: string, resumeId: string) => Promise<void>;
  clearError: () => void;
}

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export const useJobStore = create<JobState>()(
  persist(
    (set, get) => ({
      jobs: [],
      isLoading: false,
      error: null,
      lastFetchedAt: null,

      clearError: () => set({ error: null }),

      fetchJobs: async (force = false) => {
        const { lastFetchedAt, isLoading } = get();
        if (isLoading) return;

        const now = Date.now();
        if (!force && lastFetchedAt && now - lastFetchedAt < CACHE_TTL_MS) {
          return;
        }

        try {
          set({ isLoading: true, error: null });
          const jobs = await JobService.getJobs();
          set({ jobs, lastFetchedAt: now, isLoading: false });
        } catch (err: unknown) {
          const error = err as Error;
          set({ error: error.message || 'Failed to fetch jobs', isLoading: false });
        }
      },

      getJobById: async (id: string, force = false) => {
        const { jobs } = get();
        
        // Return from cache if we have the full object (including keywords/analysis)
        const cached = jobs.find(j => j.id === id);
        if (!force && cached && cached.keywords) {
          return cached;
        }

        try {
          set({ isLoading: true, error: null });
          const job = await JobService.getJobById(id);
          
          // Update cache
          set(state => ({
            jobs: state.jobs.some(j => j.id === id)
              ? state.jobs.map(j => (j.id === id ? job : j))
              : [...state.jobs, job],
            isLoading: false
          }));
          
          return job;
        } catch (err: unknown) {
          const error = err as Error;
          set({ error: error.message || 'Failed to fetch job', isLoading: false });
          return null;
        }
      },

      createJob: async (payload: JobCreatePayload) => {
        try {
          set({ isLoading: true, error: null });
          const newJob = await JobService.createJob(payload);
          set(state => ({
            jobs: [newJob, ...state.jobs],
            isLoading: false
          }));
          return newJob;
        } catch (err: unknown) {
          const error = err as Error;
          set({ error: error.message || 'Failed to create job', isLoading: false });
          throw err;
        }
      },

      updateJob: async (id: string, payload: JobUpdatePayload) => {
        try {
          set({ isLoading: true, error: null });
          const updated = await JobService.updateJob(id, payload);
          set(state => ({
            jobs: state.jobs.map(j => (j.id === id ? { ...j, ...updated } : j)),
            isLoading: false
          }));
          return updated;
        } catch (err: unknown) {
          const error = err as Error;
          set({ error: error.message || 'Failed to update job', isLoading: false });
          throw err;
        }
      },

      deleteJob: async (id: string) => {
        try {
          set({ isLoading: true, error: null });
          await JobService.deleteJob(id);
          set(state => ({
            jobs: state.jobs.filter(j => j.id !== id),
            isLoading: false
          }));
        } catch (err: unknown) {
          const error = err as Error;
          set({ error: error.message || 'Failed to delete job', isLoading: false });
          throw err;
        }
      },

      analyzeJob: async (id: string) => {
        try {
          set({ isLoading: true, error: null });
          const result = await JobService.analyzeJob(id);
          
          // Update local cache with new analysis
          set(state => ({
            jobs: state.jobs.map(j => {
              if (j.id === id) {
                return {
                  ...j,
                  parsedData: result.parsed,
                  keywords: result.keywords,
                  analysis: result.analysis,
                  isParsed: true
                };
              }
              return j;
            }),
            isLoading: false
          }));
          
          return result;
        } catch (err: unknown) {
          const error = err as Error;
          set({ error: error.message || 'Failed to analyze job', isLoading: false });
          throw err;
        }
      },

      linkResume: async (jobId: string, resumeId: string) => {
        try {
          set({ isLoading: true, error: null });
          await JobService.linkResume(jobId, resumeId);
          
          // Update cache
          set(state => ({
            jobs: state.jobs.map(j => {
              if (j.id === jobId) {
                const existing = j.linkedResumes || [];
                if (!existing.some(r => r.resumeId === resumeId)) {
                  return {
                    ...j,
                    linkedResumes: [...existing, { resumeId, createdAt: new Date().toISOString() }]
                  };
                }
              }
              return j;
            }),
            isLoading: false
          }));
        } catch (err: unknown) {
          const error = err as Error;
          set({ error: error.message || 'Failed to link resume', isLoading: false });
          throw err;
        }
      },

      unlinkResume: async (jobId: string, resumeId: string) => {
        try {
          set({ isLoading: true, error: null });
          await JobService.unlinkResume(jobId, resumeId);
          
          // Update cache
          set(state => ({
            jobs: state.jobs.map(j => {
              if (j.id === jobId) {
                return {
                  ...j,
                  linkedResumes: (j.linkedResumes || []).filter(r => r.resumeId !== resumeId)
                };
              }
              return j;
            }),
            isLoading: false
          }));
        } catch (err: unknown) {
          const error = err as Error;
          set({ error: error.message || 'Failed to unlink resume', isLoading: false });
          throw err;
        }
      }
    }),
    {
      name: 'job-storage',
      partialize: (state) => ({ jobs: state.jobs, lastFetchedAt: state.lastFetchedAt }), // only persist data
    }
  )
);
