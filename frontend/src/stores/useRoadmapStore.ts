import { create } from "zustand";
import { RoadmapService, type CareerRoadmapRecord, type CareerRoadmapItemRecord } from "@/services/RoadmapService";

interface RoadmapStoreState {
  targetRole: string;
  targetCompany: string;

  activeRoadmap: CareerRoadmapRecord | null;
  items: CareerRoadmapItemRecord[];
  progress: number;
  roadmapsList: CareerRoadmapRecord[];

  isGenerating: boolean;
  isLoading: boolean;
  error: string | null;

  setTargetRole: (role: string) => void;
  setTargetCompany: (company: string) => void;

  generateRoadmap: (missingSkills?: string[]) => Promise<void>;
  fetchRoadmaps: () => Promise<void>;
  selectRoadmap: (id: string) => Promise<void>;
  toggleItemStatus: (itemId: string, newStatus: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED") => Promise<void>;
  deleteRoadmap: (id: string) => Promise<void>;
}

export const useRoadmapStore = create<RoadmapStoreState>((set, get) => ({
  targetRole: "Senior Software Engineer",
  targetCompany: "Tier 1 Tech",

  activeRoadmap: null,
  items: [],
  progress: 0,
  roadmapsList: [],

  isGenerating: false,
  isLoading: false,
  error: null,

  setTargetRole: (targetRole) => set({ targetRole }),
  setTargetCompany: (targetCompany) => set({ targetCompany }),

  generateRoadmap: async (missingSkills?: string[]) => {
    const { targetRole, targetCompany } = get();
    set({ isGenerating: true, error: null });

    try {
      const data = await RoadmapService.generate({
        targetRole,
        targetCompany,
        missingSkills,
      });

      set({
        activeRoadmap: data.roadmap,
        items: data.items,
        progress: data.progress,
        isGenerating: false,
      });

      void get().fetchRoadmaps();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to generate career roadmap.";
      set({ error: message, isGenerating: false });
    }
  },

  fetchRoadmaps: async () => {
    set({ isLoading: true });
    try {
      const list = await RoadmapService.list();
      set({ roadmapsList: list, isLoading: false });

      if (list.length > 0 && !get().activeRoadmap) {
        void get().selectRoadmap(list[0].id);
      }
    } catch (err) {
      set({ isLoading: false });
    }
  },

  selectRoadmap: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const data = await RoadmapService.get(id);
      set({
        activeRoadmap: data.roadmap,
        items: data.items,
        progress: data.progress,
        targetRole: data.roadmap.targetRole,
        isLoading: false,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch roadmap details.";
      set({ error: message, isLoading: false });
    }
  },

  toggleItemStatus: async (itemId: string, newStatus) => {
    const { activeRoadmap, items } = get();
    if (!activeRoadmap) return;

    try {
      const res = await RoadmapService.updateItemStatus(activeRoadmap.id, itemId, newStatus);
      const updatedItems = items.map((i) => (i.id === itemId ? res.updatedItem : i));
      set({ items: updatedItems, progress: res.overallProgress });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update item status.";
      set({ error: message });
    }
  },

  deleteRoadmap: async (id: string) => {
    try {
      await RoadmapService.delete(id);
      const list = get().roadmapsList.filter((r) => r.id !== id);
      set({ roadmapsList: list });
      if (get().activeRoadmap?.id === id) {
        set({ activeRoadmap: list.length > 0 ? list[0] : null, items: [], progress: 0 });
      }
    } catch (err) {
      set({ error: "Failed to delete roadmap." });
    }
  },
}));
