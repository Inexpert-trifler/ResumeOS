import { create } from 'zustand';
import type { CoachMessage, ConversationSession } from '@/types';

interface CoachStoreState {
  messages: CoachMessage[];
  sessions: ConversationSession[];
  activeSessionId: string | null;
  isTyping: boolean;
  addMessage: (message: CoachMessage) => void;
  setIsTyping: (typing: boolean) => void;
  setActiveSession: (id: string | null) => void;
  addSession: (session: ConversationSession) => void;
  clearChat: () => void;
}

export const useCoachStore = create<CoachStoreState>((set) => ({
  messages: [],
  sessions: [],
  activeSessionId: null,
  isTyping: false,
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  setIsTyping: (typing) => set({ isTyping: typing }),
  setActiveSession: (id) => set({ activeSessionId: id }),
  addSession: (session) =>
    set((state) => ({ sessions: [...state.sessions, session] })),
  clearChat: () => set({ messages: [], isTyping: false, activeSessionId: null }),
}));
