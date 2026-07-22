"use client";

import { createContext, useContext, useReducer, ReactNode } from "react";
import { StudioState, StudioAction, ResumeData, ResumeSection, StudioSettings } from '@/types';
import { MOCK_RESUME, DEFAULT_SECTIONS, DEFAULT_SETTINGS } from "@/data/mock-resume";
import { readResumeDraft } from "@/lib/resume-draft";

const MAX_HISTORY = 30;

function buildInitialState(): StudioState {
  // Try to load from the builder draft first
  if (typeof window !== "undefined") {
    const draft = readResumeDraft();
    if (draft?.resume) {
      return {
        resume: draft.resume,
        sections: draft.sections ?? DEFAULT_SECTIONS,
        settings: draft.settings ?? DEFAULT_SETTINGS,
        history: [draft.resume],
        historyIndex: 0,
        activeSectionId: null,
      };
    }
  }
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

  const canUndo = state.historyIndex > 0;
  const canRedo = state.historyIndex < state.history.length - 1;

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
