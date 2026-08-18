import { create } from "zustand";
import { CoverLetterService, type CoverLetterRecord, type GenerateCoverLetterPayload } from "@/services/CoverLetterService";

interface CoverLetterStoreState {
  company: string;
  role: string;
  jobDescription: string;
  tone: string;

  activeLetter: CoverLetterRecord | null;
  letters: CoverLetterRecord[];
  isGenerating: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  setCompany: (val: string) => void;
  setRole: (val: string) => void;
  setJobDescription: (val: string) => void;
  setTone: (val: string) => void;
  setInputs: (company: string, role: string, jobDescription?: string, tone?: string) => void;

  generateCoverLetter: (resumeId?: string) => Promise<CoverLetterRecord | null>;
  fetchLetters: () => Promise<void>;
  selectLetter: (id: string) => Promise<void>;
  updateLetterContent: (id: string, content: string) => Promise<void>;
  deleteLetter: (id: string) => Promise<void>;
}

export const useCoverLetterStore = create<CoverLetterStoreState>((set, get) => ({
  company: "",
  role: "",
  jobDescription: "",
  tone: "professional",

  activeLetter: null,
  letters: [],
  isGenerating: false,
  isLoading: false,
  error: null,

  setCompany: (company) => set({ company }),
  setRole: (role) => set({ role }),
  setJobDescription: (jobDescription) => set({ jobDescription }),
  setTone: (tone) => set({ tone }),
  setInputs: (company, role, jobDescription = "", tone = "professional") => set({ company, role, jobDescription, tone }),

  generateCoverLetter: async (resumeId?: string) => {
    const { company, role, jobDescription, tone } = get();
    if (!company.trim() || !role.trim()) {
      set({ error: "Please enter both Company Name and Target Role." });
      return null;
    }

    set({ isGenerating: true, error: null });
    try {
      const payload: GenerateCoverLetterPayload = {
        resumeId,
        company: company.trim(),
        role: role.trim(),
        jobDescription: jobDescription.trim(),
        tone,
      };

      const record = await CoverLetterService.generate(payload);
      const letters = await CoverLetterService.list();
      set({ activeLetter: record, letters, isGenerating: false });
      return record;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to generate cover letter.";
      set({ error: message, isGenerating: false });
      return null;
    }
  },

  fetchLetters: async () => {
    set({ isLoading: true, error: null });
    try {
      const letters = await CoverLetterService.list();
      set({ letters, isLoading: false });
      if (letters.length > 0 && !get().activeLetter) {
        set({ activeLetter: letters[0] });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load cover letters.";
      set({ error: message, isLoading: false });
    }
  },

  selectLetter: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const letter = await CoverLetterService.get(id);
      set({ activeLetter: letter, isLoading: false, company: "", role: "", jobDescription: "", tone: letter.tone });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch cover letter.";
      set({ error: message, isLoading: false });
    }
  },

  updateLetterContent: async (id: string, content: string) => {
    try {
      const updated = await CoverLetterService.update(id, content);
      const letters = get().letters.map((l) => (l.id === id ? updated : l));
      set({ activeLetter: updated, letters });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update cover letter.";
      set({ error: message });
    }
  },

  deleteLetter: async (id: string) => {
    try {
      await CoverLetterService.delete(id);
      const letters = get().letters.filter((l) => l.id !== id);
      set({ letters });
      if (get().activeLetter?.id === id) {
        set({ activeLetter: letters.length > 0 ? letters[0] : null });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete cover letter.";
      set({ error: message });
    }
  },
}));
