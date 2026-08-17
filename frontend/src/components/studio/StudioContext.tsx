"use client";

import { createContext, useContext, useReducer, useEffect, useRef, ReactNode } from "react";
import { StudioState, StudioAction, ResumeData } from '@/types';
import { MOCK_RESUME, DEFAULT_SECTIONS, DEFAULT_SETTINGS } from "@/data/mock-resume";
import { createStudioDraft, readResumeDraft, saveResumeDraft } from "@/lib/resume-draft";
import { CLOUD_DRAFT_RESTORED_EVENT } from "@/providers/cloud-sync-provider";

const MAX_HISTORY = 30;

function buildInitialState(): StudioState {
  return {
    resume: MOCK_RESUME,
    sections: DEFAULT_SECTIONS,
    settings: DEFAULT_SETTINGS,
    history: [MOCK_RESUME],
    historyIndex: 0,
    activeSectionId: null,
  };
}

function pushHistory(history: ResumeData[], index: number, newData: ResumeData): { history: ResumeData[]; historyIndex: number } {
  const trimmed = history.slice(0, index + 1);
  const next = [...trimmed, newData].slice(-MAX_HISTORY);
  return { history: next, historyIndex: next.length - 1 };
}

function studioReducer(state: StudioState, action: StudioAction): StudioState {
  switch (action.type) {
    case "UPDATE_HEADER": {
      const newResume = { ...state.resume, header: { ...state.resume.header, ...action.payload } };
      return { ...state, resume: newResume, ...pushHistory(state.history, state.historyIndex, newResume) };
    }
    case "UPDATE_SUMMARY": {
      const newResume = { ...state.resume, summary: action.payload };
      return { ...state, resume: newResume, ...pushHistory(state.history, state.historyIndex, newResume) };
    }
    case "UPDATE_EXPERIENCE": {
      const newResume = { ...state.resume, experience: action.payload };
      return { ...state, resume: newResume, ...pushHistory(state.history, state.historyIndex, newResume) };
    }
    case "UPDATE_EDUCATION": {
      const newResume = { ...state.resume, education: action.payload };
      return { ...state, resume: newResume, ...pushHistory(state.history, state.historyIndex, newResume) };
    }
    case "UPDATE_SKILLS": {
      const newResume = { ...state.resume, skills: action.payload };
      return { ...state, resume: newResume, ...pushHistory(state.history, state.historyIndex, newResume) };
    }
    case "UPDATE_PROJECTS": {
      const newResume = { ...state.resume, projects: action.payload };
      return { ...state, resume: newResume, ...pushHistory(state.history, state.historyIndex, newResume) };
    }
    case "UPDATE_ACHIEVEMENTS": {
      const newResume = { ...state.resume, achievements: action.payload };
      return { ...state, resume: newResume, ...pushHistory(state.history, state.historyIndex, newResume) };
    }
    case "UPDATE_CERTIFICATES": {
      const newResume = { ...state.resume, certificates: action.payload };
      return { ...state, resume: newResume, ...pushHistory(state.history, state.historyIndex, newResume) };
    }
    case "UPDATE_LEADERSHIP": {
      const newResume = { ...state.resume, leadership: action.payload };
      return { ...state, resume: newResume, ...pushHistory(state.history, state.historyIndex, newResume) };
    }
    case "UPDATE_LANGUAGES": {
      const newResume = { ...state.resume, languages: action.payload };
      return { ...state, resume: newResume, ...pushHistory(state.history, state.historyIndex, newResume) };
    }
    case "UPDATE_INTERESTS": {
      const newResume = { ...state.resume, interests: action.payload };
      return { ...state, resume: newResume, ...pushHistory(state.history, state.historyIndex, newResume) };
    }
    case "REORDER_SECTIONS":
      return { ...state, sections: action.payload };
    case "TOGGLE_SECTION":
      return {
        ...state,
        sections: state.sections.map(s =>
          s.id === action.payload ? { ...s, visible: !s.visible } : s
        ),
      };
    case "UPDATE_SETTINGS":
      return { ...state, settings: { ...state.settings, ...action.payload } };
    case "SET_ACTIVE_SECTION":
      return { ...state, activeSectionId: action.payload };
    case "HYDRATE":
      return {
        ...state,
        ...action.payload,
        history: [action.payload.resume],
        historyIndex: 0,
        activeSectionId: null,
      };
    case "UNDO": {
      if (state.historyIndex <= 0) return state;
      const newIndex = state.historyIndex - 1;
      return { ...state, resume: state.history[newIndex], historyIndex: newIndex };
    }
    case "REDO": {
      if (state.historyIndex >= state.history.length - 1) return state;
      const newIndex = state.historyIndex + 1;
      return { ...state, resume: state.history[newIndex], historyIndex: newIndex };
    }
    default:
      return state;
  }
}

interface StudioContextValue {
  state: StudioState;
  dispatch: React.Dispatch<StudioAction>;
  canUndo: boolean;
  canRedo: boolean;
}

const StudioContext = createContext<StudioContextValue | null>(null);

export function StudioProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(studioReducer, undefined, buildInitialState);
  const didHydrate = useRef(false);

  const canUndo = state.historyIndex > 0;
  const canRedo = state.historyIndex < state.history.length - 1;

  // Hydrate from localStorage exactly once after the component mounts
  useEffect(() => {
    const draft = readResumeDraft();
    if (draft?.resume) {
      dispatch({
        type: "HYDRATE",
        payload: {
          resume: draft.resume,
          sections: draft.sections ?? DEFAULT_SECTIONS,
          settings: draft.settings ?? DEFAULT_SETTINGS,
        },
      });
    }
    // We set didHydrate to true so the next effect starts saving changes
    didHydrate.current = true;
  }, []);

  // Save changes to localStorage after hydration
  useEffect(() => {
    if (!didHydrate.current) return;

    const timer = window.setTimeout(() => {
      const existing = readResumeDraft();
      saveResumeDraft(
        createStudioDraft(state.resume, existing, new Date(), {
          sections: state.sections,
          settings: state.settings,
        })
      );
    }, 400);

    return () => window.clearTimeout(timer);
  }, [state.resume, state.sections, state.settings]);

  useEffect(() => {
    const restoreCloudDraft = () => {
      const draft = readResumeDraft();
      if (!draft?.resume) return;
      dispatch({
        type: "HYDRATE",
        payload: {
          resume: draft.resume,
          sections: draft.sections ?? DEFAULT_SECTIONS,
          settings: draft.settings ?? DEFAULT_SETTINGS,
        },
      });
    };

    window.addEventListener(CLOUD_DRAFT_RESTORED_EVENT, restoreCloudDraft);
    return () => window.removeEventListener(CLOUD_DRAFT_RESTORED_EVENT, restoreCloudDraft);
  }, []);

  useEffect(() => {
    const handlePageHide = () => {
      const existing = readResumeDraft();
      saveResumeDraft(
        createStudioDraft(state.resume, existing, new Date(), {
          sections: state.sections,
          settings: state.settings,
        })
      );
    };

    window.addEventListener("pagehide", handlePageHide);
    return () => window.removeEventListener("pagehide", handlePageHide);
  }, [state.resume, state.sections, state.settings]);

  return (
    <StudioContext.Provider value={{ state, dispatch, canUndo, canRedo }}>
      {children}
    </StudioContext.Provider>
  );
}

export function useStudio() {
  const ctx = useContext(StudioContext);
  if (!ctx) throw new Error("useStudio must be used within StudioProvider");
  return ctx;
}
