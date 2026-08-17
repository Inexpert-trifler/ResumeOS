/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Placeholder for AI Career Coach API service
 * Will handle chat messages and AI completions
 */
export class CoachService {
  static async sendMessage(_message: string, _context?: unknown) {
    // throw new Error('Not implemented');
    return {
      text: "This is a placeholder response.",
      suggestions: [] as string[],
    };
  }

  static async getConversationHistory(_sessionId: string) {
    // throw new Error('Not implemented');
    return [];
  }
}
