import type { Response } from "express";
import { type AuthenticatedRequest } from "../middleware/auth";
import { CoachRepository } from "../repositories/coach.repository";
import { ResumeService } from "../services/resume.service";
import { AIService } from "../services/ai.service";

const coachRepo = new CoachRepository();
const resumeService = new ResumeService();

export class CoachController {
  /**
   * POST /api/coach/conversations
   */
  async createConversation(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.currentUser!.id;
      const { title } = req.body;
      const conversation = await coachRepo.createConversation(userId, title || "Resume Coaching");
      
      // Seed initial welcome message from AI
      await coachRepo.addMessage(
        conversation.id,
        "assistant",
        "Hello! I am your ResumeOS AI Coach. I'm here to analyze your resume, help you target roles, and rewrite your bullets for maximum impact. What would you like to focus on today?"
      );

      const messages = await coachRepo.getMessages(conversation.id);
      res.status(201).json({ success: true, data: { ...conversation, messages } });
    } catch (error) {
      console.error("[CoachController] createConversation error:", error);
      res.status(500).json({ success: false, error: "Failed to create conversation." });
    }
  }

  /**
   * GET /api/coach/conversations
   */
  async listConversations(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.currentUser!.id;
      let conversations = await coachRepo.listConversations(userId);

      // Auto-create a default conversation if user has none
      if (conversations.length === 0) {
        const newConv = await coachRepo.createConversation(userId, "Resume Coaching");
        await coachRepo.addMessage(
          newConv.id,
          "assistant",
          "Hello! I am your ResumeOS AI Coach. I'm here to analyze your resume, help you target roles, and rewrite your bullets for maximum impact. What would you like to focus on today?"
        );
        conversations = [newConv];
      }

      res.json({ success: true, data: conversations });
    } catch (error) {
      console.error("[CoachController] listConversations error:", error);
      res.status(500).json({ success: false, error: "Failed to list conversations." });
    }
  }

  /**
   * GET /api/coach/conversations/:id
   */
  async getConversation(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.currentUser!.id;
      const { id } = req.params;

      const conversation = await coachRepo.getConversation(id, userId);
      if (!conversation) {
        res.status(404).json({ success: false, error: "Conversation not found." });
        return;
      }

      const messages = await coachRepo.getMessages(id);
      res.json({ success: true, data: { ...conversation, messages } });
    } catch (error) {
      console.error("[CoachController] getConversation error:", error);
      res.status(500).json({ success: false, error: "Failed to fetch conversation." });
    }
  }

  /**
   * POST /api/coach/conversations/:id/messages
   */
  async postMessage(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.currentUser!.id;
      const { id } = req.params;
      const { content, targetRole, jobDescription } = req.body;

      if (!content || typeof content !== "string" || !content.trim()) {
        res.status(400).json({ success: false, error: "Message content cannot be empty." });
        return;
      }

      if (content.trim().length > 4000) {
        res.status(400).json({ success: false, error: "Message is too long. Max 4,000 characters." });
        return;
      }

      // Verify conversation ownership
      const conversation = await coachRepo.getConversation(id, userId);
      if (!conversation) {
        res.status(404).json({ success: false, error: "Conversation not found." });
        return;
      }

      // Load conversation history BEFORE saving new message
      const history = await coachRepo.getMessages(id);

      // Save user message to DB
      const userMsg = await coachRepo.addMessage(id, "user", content.trim());

      // Fetch user's latest active resume context from DB
      const userResumes = await resumeService.list(userId);
      const activeResume = userResumes[0]?.resumeJson ?? null;

      // Call AI Engine
      const aiResult = await AIService.coachResume({
        resumeContext: activeResume as Record<string, unknown> | null,
        conversationHistory: history.map((m) => ({ role: m.role, content: m.content })),
        userMessage: content.trim(),
        targetRole,
        jobDescription,
      });

      // Save AI assistant reply to DB
      const assistantMsg = await coachRepo.addMessage(id, "assistant", aiResult.reply);

      res.json({
        success: true,
        data: {
          userMessage: userMsg,
          assistantMessage: assistantMsg,
          suggestions: aiResult.suggestions,
          actions: aiResult.actions,
        },
      });
    } catch (error) {
      console.error("[CoachController] postMessage error:", error);
      const message = error instanceof Error ? error.message : "AI Coach encountered an issue.";
      res.status(500).json({
        success: false,
        error: {
          code: "COACH_ERROR",
          message,
        },
      });
    }
  }

  /**
   * DELETE /api/coach/conversations/:id
   */
  async deleteConversation(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.currentUser!.id;
      const { id } = req.params;

      const deleted = await coachRepo.deleteConversation(id, userId);
      if (!deleted) {
        res.status(404).json({ success: false, error: "Conversation not found." });
        return;
      }

      res.json({ success: true, message: "Conversation deleted." });
    } catch (error) {
      console.error("[CoachController] deleteConversation error:", error);
      res.status(500).json({ success: false, error: "Failed to delete conversation." });
    }
  }
}
