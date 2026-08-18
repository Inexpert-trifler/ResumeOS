import { create } from "zustand";
import { CoachService, type CoachConversation, type CoachMessage } from "@/services/CoachService";

interface CoachStoreState {
  conversations: CoachConversation[];
  activeConversationId: string | null;
  activeConversation: CoachConversation | null;
  isLoading: boolean;
  isSending: boolean;
  error: string | null;
  suggestions: string[];
  actions: Array<{ type: string; label: string }>;

  // Actions
  fetchConversations: () => Promise<void>;
  selectConversation: (id: string) => Promise<void>;
  createConversation: (title?: string) => Promise<void>;
  sendMessage: (content: string, targetRole?: string, jobDescription?: string) => Promise<void>;
  deleteConversation: (id: string) => Promise<void>;
}

export const useCoachStore = create<CoachStoreState>((set, get) => ({
  conversations: [],
  activeConversationId: null,
  activeConversation: null,
  isLoading: false,
  isSending: false,
  error: null,
  suggestions: [
    "How can I tailor my resume for a Senior Software Engineer role?",
    "What action verbs should I use for leadership?",
    "How do I highlight my system design accomplishments?",
  ],
  actions: [],

  fetchConversations: async () => {
    set({ isLoading: true, error: null });
    try {
      const conversations = await CoachService.listConversations();
      set({ conversations, isLoading: false });

      if (conversations.length > 0) {
        const currentActive = get().activeConversationId;
        const targetId = currentActive && conversations.some((c) => c.id === currentActive)
          ? currentActive
          : conversations[0].id;
        await get().selectConversation(targetId);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load coach conversations.";
      set({ error: message, isLoading: false });
    }
  },

  selectConversation: async (id: string) => {
    set({ activeConversationId: id, isLoading: true, error: null });
    try {
      const conversation = await CoachService.getConversation(id);
      set({ activeConversation: conversation, isLoading: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load conversation details.";
      set({ error: message, isLoading: false });
    }
  },

  createConversation: async (title?: string) => {
    set({ isLoading: true, error: null });
    try {
      const conversation = await CoachService.createConversation(title);
      const conversations = await CoachService.listConversations();
      set({ conversations, activeConversationId: conversation.id, activeConversation: conversation, isLoading: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create conversation.";
      set({ error: message, isLoading: false });
    }
  },

  sendMessage: async (content: string, targetRole?: string, jobDescription?: string) => {
    const { activeConversationId, activeConversation } = get();
    if (!activeConversationId) {
      set({ error: "No active conversation selected." });
      return;
    }

    // Optimistically add user message to UI
    const tempUserMsg: CoachMessage = {
      id: `temp-${Date.now()}`,
      conversationId: activeConversationId,
      role: "user",
      content,
      createdAt: new Date().toISOString(),
    };

    const existingMessages = activeConversation?.messages ?? [];
    set({
      isSending: true,
      error: null,
      activeConversation: activeConversation
        ? { ...activeConversation, messages: [...existingMessages, tempUserMsg] }
        : null,
    });

    try {
      const result = await CoachService.sendMessage(activeConversationId, content, targetRole, jobDescription);
      
      // Update with server persisted messages
      const updatedMessages = [...existingMessages, result.userMessage, result.assistantMessage];
      set({
        isSending: false,
        suggestions: result.suggestions.length > 0 ? result.suggestions : get().suggestions,
        actions: result.actions || [],
        activeConversation: activeConversation
          ? { ...activeConversation, messages: updatedMessages }
          : null,
      });

      // Refresh list to update timestamps
      const conversations = await CoachService.listConversations();
      set({ conversations });
    } catch (err) {
      const message = err instanceof Error ? err.message : "AI Coach failed to respond.";
      // Revert optimistic user message on error
      set({
        isSending: false,
        error: message,
        activeConversation: activeConversation
          ? { ...activeConversation, messages: existingMessages }
          : null,
      });
    }
  },

  deleteConversation: async (id: string) => {
    try {
      await CoachService.deleteConversation(id);
      const conversations = get().conversations.filter((c) => c.id !== id);
      set({ conversations });
      if (get().activeConversationId === id) {
        if (conversations.length > 0) {
          await get().selectConversation(conversations[0].id);
        } else {
          set({ activeConversationId: null, activeConversation: null });
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete conversation.";
      set({ error: message });
    }
  },
}));
