import { eq, desc, and } from "drizzle-orm";
import { db } from "../db";
import { interviewSessions, interviewQuestions, interviewAnswers, jobDescriptions } from "../db/schema";

export type InterviewSessionRecord = typeof interviewSessions.$inferSelect;
export type InterviewQuestionRecord = typeof interviewQuestions.$inferSelect;
export type InterviewAnswerRecord = typeof interviewAnswers.$inferSelect;

export class InterviewRepository {
  async createSession(input: {
    userId: string;
    resumeId: string;
    jobId?: string;
    targetRole?: string;
    interviewType?: string;
    difficulty?: string;
  }): Promise<InterviewSessionRecord> {
    let jobId = input.jobId;
    if (!jobId) {
      const userJobs = await db.query.jobDescriptions.findMany({
        where: (jobs, { eq }) => eq(jobs.userId, input.userId),
        limit: 1,
      });

      if (userJobs.length > 0) {
        jobId = userJobs[0].id;
      } else {
        const [dummyJob] = await db
          .insert(jobDescriptions)
          .values({
            userId: input.userId,
            jobTitle: input.targetRole || "Software Engineer",
            company: "Target Company",
            rawDescription: "General target job description for mock interview practice.",
          })
          .returning();
        jobId = dummyJob.id;
      }
    }

    const [session] = await db
      .insert(interviewSessions)
      .values({
        userId: input.userId,
        resumeId: input.resumeId,
        jobId: jobId!,
      })
      .returning();

    return session;
  }

  async listSessions(userId: string): Promise<InterviewSessionRecord[]> {
    return db
      .select()
      .from(interviewSessions)
      .where(eq(interviewSessions.userId, userId))
      .orderBy(desc(interviewSessions.createdAt));
  }

  async getSession(id: string, userId: string): Promise<{
    session: InterviewSessionRecord;
    questions: Array<InterviewQuestionRecord & { answer?: InterviewAnswerRecord | null }>;
  } | null> {
    const [session] = await db
      .select()
      .from(interviewSessions)
      .where(and(eq(interviewSessions.id, id), eq(interviewSessions.userId, userId)))
      .limit(1);

    if (!session) return null;

    const questions = await db
      .select()
      .from(interviewQuestions)
      .where(eq(interviewQuestions.sessionId, id));

    const questionsWithAnswers = await Promise.all(
      questions.map(async (q) => {
        const [answer] = await db
          .select()
          .from(interviewAnswers)
          .where(eq(interviewAnswers.questionId, q.id))
          .limit(1);
        return { ...q, answer: answer ?? null };
      })
    );

    return { session, questions: questionsWithAnswers };
  }

  async saveQuestions(
    sessionId: string,
    questionsList: Array<{
      category: string;
      question: string;
      difficulty?: string;
      whyItMayBeAsked?: string;
      suggestedAnswer?: string;
      keyPoints?: string[];
    }>
  ): Promise<InterviewQuestionRecord[]> {
    const records = await Promise.all(
      questionsList.map(async (item) => {
        const [created] = await db
          .insert(interviewQuestions)
          .values({
            sessionId,
            category: item.category,
            question: item.question,
            difficulty: item.difficulty || "intermediate",
            whyItMayBeAsked: item.whyItMayBeAsked || "",
            suggestedAnswer: item.suggestedAnswer || "",
            keyPoints: item.keyPoints || [],
          })
          .returning();
        return created;
      })
    );
    return records;
  }

  async saveAnswer(questionId: string, answerText: string): Promise<InterviewAnswerRecord> {
    // Check if answer already exists
    const [existing] = await db
      .select()
      .from(interviewAnswers)
      .where(eq(interviewAnswers.questionId, questionId))
      .limit(1);

    if (existing) {
      const [updated] = await db
        .update(interviewAnswers)
        .set({ answerText })
        .where(eq(interviewAnswers.id, existing.id))
        .returning();
      return updated;
    }

    const [created] = await db
      .insert(interviewAnswers)
      .values({
        questionId,
        answerText,
      })
      .returning();

    return created;
  }

  async saveEvaluation(
    answerId: string,
    feedback: string,
    score: number
  ): Promise<InterviewAnswerRecord> {
    const [updated] = await db
      .update(interviewAnswers)
      .set({ feedback, score })
      .where(eq(interviewAnswers.id, answerId))
      .returning();
    return updated;
  }
}
