import type { Response } from "express";
import { type AuthenticatedRequest } from "../middleware/auth";
import { InterviewRepository } from "../repositories/interview.repository";
import { ResumeService } from "../services/resume.service";
import { JobRepository } from "../repositories/job.repository";
import { AIService } from "../services/ai.service";

const interviewRepo = new InterviewRepository();
const resumeService = new ResumeService();
const jobRepo = new JobRepository();

export class InterviewController {
  /**
   * POST /api/interviews/sessions
   */
  async createSession(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.currentUser!.id;
      const { resumeId, jobId, type, interviewType, difficulty, targetRole } = req.body;

      // 1. Verify Resume Ownership
      let activeResumeId = resumeId;
      if (resumeId && typeof resumeId === "string") {
        const resumeRecord = await resumeService.get(resumeId, userId);
        if (!resumeRecord) {
          res.status(404).json({ success: false, error: "Selected resume not found or unauthorized access." });
          return;
        }
        activeResumeId = resumeRecord.id;
      } else {
        const userResumes = await resumeService.list(userId);
        if (userResumes.length > 0) {
          activeResumeId = userResumes[0].id;
        }
      }

      if (!activeResumeId) {
        res.status(400).json({ success: false, error: "Please save or upload a resume before starting an interview session." });
        return;
      }

      // 2. Verify Job Ownership if jobId provided
      let verifiedJobId = jobId;
      let resolvedTargetRole = targetRole || "Software Engineer";
      if (jobId && typeof jobId === "string") {
        const jobRecord = await jobRepo.findOwned(jobId, userId);
        if (!jobRecord) {
          res.status(404).json({ success: false, error: "Tracked job not found or unauthorized access." });
          return;
        }
        verifiedJobId = jobRecord.id;
        if (!targetRole) resolvedTargetRole = jobRecord.jobTitle;
      }

      const sessionType = (type || interviewType || "MIXED").toString().toUpperCase();
      const sessionDiff = (difficulty || "MEDIUM").toString().toUpperCase();

      const session = await interviewRepo.createSession({
        userId,
        resumeId: activeResumeId,
        jobId: verifiedJobId,
        targetRole: resolvedTargetRole,
        interviewType: sessionType,
        difficulty: sessionDiff,
      });

      res.status(201).json({ success: true, data: session });
    } catch (error) {
      console.error("[InterviewController] createSession error:", error);
      res.status(500).json({ success: false, error: "Failed to create interview session." });
    }
  }

  /**
   * POST /api/interviews/sessions/:id/questions
   */
  async generateQuestions(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.currentUser!.id;
      const { id } = req.params;
      const { targetRole, type, interviewType, difficulty, count } = req.body;

      const sessionData = await interviewRepo.getSession(id, userId);
      if (!sessionData) {
        res.status(404).json({ success: false, error: "Interview session not found or unauthorized access." });
        return;
      }

      // Fetch resume details for prompt context
      const resume = await resumeService.get(sessionData.session.resumeId, userId);
      const resumeContext = resume ? (resume.resumeJson as Record<string, unknown>) : null;

      // Fetch tracked job details if linked
      let jobDescriptionStr: string | undefined;
      if (sessionData.session.jobId) {
        const jobRecord = await jobRepo.findOwned(sessionData.session.jobId, userId);
        if (jobRecord) {
          jobDescriptionStr = jobRecord.rawDescription;
        }
      }

      const sessionType = (type || interviewType || "MIXED").toString().toLowerCase();
      const sessionDiff = (difficulty || "MEDIUM").toString().toLowerCase();

      const generated = await AIService.generateInterviewQuestions({
        resumeContext,
        targetRole: targetRole || "Software Engineer",
        jobDescription: jobDescriptionStr,
        interviewType: sessionType,
        difficulty: sessionDiff,
        count: count || 5,
      });

      const savedQuestions = await interviewRepo.saveQuestions(id, generated);

      res.json({ success: true, data: savedQuestions });
    } catch (error) {
      console.error("[InterviewController] generateQuestions error:", error);
      res.status(500).json({ success: false, error: "Failed to generate interview questions." });
    }
  }

  /**
   * POST /api/interviews/sessions/:sessionId/answers
   */
  async submitAnswer(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.currentUser!.id;
      const { sessionId } = req.params;
      const { questionId, answer, answerText } = req.body;

      const userSubmittedAnswer = typeof answer === "string" ? answer.trim() : typeof answerText === "string" ? answerText.trim() : "";

      if (!questionId || !userSubmittedAnswer) {
        res.status(400).json({ success: false, error: "questionId and answer are required." });
        return;
      }

      const sessionData = await interviewRepo.getSession(sessionId, userId);
      if (!sessionData) {
        res.status(404).json({ success: false, error: "Session not found or unauthorized access." });
        return;
      }

      const targetQuestion = sessionData.questions.find((q) => q.id === questionId);
      if (!targetQuestion) {
        res.status(400).json({ success: false, error: "Question does not belong to this interview session." });
        return;
      }

      // Save user answer
      const savedAnswer = await interviewRepo.saveAnswer(questionId, userSubmittedAnswer);

      // Evaluate answer via AIService immediately
      const resume = await resumeService.get(sessionData.session.resumeId, userId);
      const resumeContext = resume ? (resume.resumeJson as Record<string, unknown>) : null;

      const evalResult = await AIService.evaluateInterviewAnswer({
        question: targetQuestion.question,
        category: targetQuestion.category,
        answerText: userSubmittedAnswer,
        resumeContext,
      });

      // Update answer record with score & evaluation feedback
      const updatedAnswer = await interviewRepo.saveEvaluation(savedAnswer.id, JSON.stringify(evalResult), evalResult.score);

      res.json({
        success: true,
        data: {
          ...updatedAnswer,
          evaluation: evalResult,
        },
      });
    } catch (error) {
      console.error("[InterviewController] submitAnswer error:", error);
      res.status(500).json({ success: false, error: "Failed to submit answer." });
    }
  }

  /**
   * POST /api/interviews/sessions/:sessionId/evaluate
   */
  async evaluateSession(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.currentUser!.id;
      const { sessionId } = req.params;

      const sessionData = await interviewRepo.getSession(sessionId, userId);
      if (!sessionData) {
        res.status(404).json({ success: false, error: "Session not found or unauthorized access." });
        return;
      }

      const resume = await resumeService.get(sessionData.session.resumeId, userId);
      const resumeContext = resume ? (resume.resumeJson as Record<string, unknown>) : null;

      // Evaluate each answered question
      const evaluations = await Promise.all(
        sessionData.questions.map(async (q) => {
          if (!q.answer || !q.answer.answerText) {
            return {
              questionId: q.id,
              question: q.question,
              category: q.category,
              score: 0,
              feedback: "No answer provided.",
              strengths: [],
              weaknesses: ["Question was skipped"],
              improvedAnswer: q.suggestedAnswer || "N/A",
              star: { situation: false, task: false, action: false, result: false },
              communication: 0,
              technicalAccuracy: 0,
              relevance: 0,
              structure: 0,
            };
          }

          const evalResult = await AIService.evaluateInterviewAnswer({
            question: q.question,
            category: q.category,
            answerText: q.answer.answerText,
            resumeContext,
          });

          await interviewRepo.saveEvaluation(q.answer.id, JSON.stringify(evalResult), evalResult.score);

          return {
            questionId: q.id,
            question: q.question,
            category: q.category,
            ...evalResult,
          };
        })
      );

      const answeredCount = evaluations.filter((e) => e.score > 0).length;
      const overallScore = answeredCount > 0
        ? Math.round(evaluations.reduce((acc, e) => acc + e.score, 0) / evaluations.length)
        : 0;

      res.json({
        success: true,
        overallScore,
        totalQuestions: sessionData.questions.length,
        answeredQuestions: answeredCount,
        evaluations,
      });
    } catch (error) {
      console.error("[InterviewController] evaluateSession error:", error);
      res.status(500).json({ success: false, error: "Failed to evaluate interview session." });
    }
  }

  /**
   * GET /api/interviews/sessions/:id
   */
  async getSession(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.currentUser!.id;
      const { id } = req.params;

      const data = await interviewRepo.getSession(id, userId);
      if (!data) {
        res.status(404).json({ success: false, error: "Session not found or unauthorized access." });
        return;
      }

      res.json({ success: true, data });
    } catch (error) {
      console.error("[InterviewController] getSession error:", error);
      res.status(500).json({ success: false, error: "Failed to fetch session." });
    }
  }

  /**
   * GET /api/interviews/sessions
   */
  async listSessions(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.currentUser!.id;
      const sessions = await interviewRepo.listSessions(userId);
      res.json({ success: true, data: sessions });
    } catch (error) {
      console.error("[InterviewController] listSessions error:", error);
      res.status(500).json({ success: false, error: "Failed to list sessions." });
    }
  }
}
