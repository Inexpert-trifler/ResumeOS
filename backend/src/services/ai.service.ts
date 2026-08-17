// AI Service — stubbed for Sprint DB foundation.
// Groq/LLM integration will be wired in the AI sprint once GROQ_API_KEY is set.

export class AIService {
  static async generateCoachResponse(_context: unknown, _history: unknown[], _userMessage: string): Promise<string> {
    return "AI Coach is not yet enabled. Configure GROQ_API_KEY to activate.";
  }

  static async generateCoverLetter(_resume: unknown, _job: unknown, _tone: string, _extraInstructions?: string): Promise<string> {
    return "Cover Letter generation is not yet enabled. Configure GROQ_API_KEY to activate.";
  }

  static async generateInterviewQuestions(_resume: unknown, _job: unknown, _category: string): Promise<unknown[]> {
    return [];
  }

  static async evaluateInterviewAnswer(_question: unknown, _answer: string, _resume: unknown): Promise<{ feedback: string; score: number }> {
    return { feedback: "AI evaluation not yet enabled.", score: 0 };
  }

  static async generateCareerRoadmap(_targetRole: string, _skills: string[], _gaps: string[]): Promise<unknown[]> {
    return [];
  }
}
