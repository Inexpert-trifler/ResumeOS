/**
 * Placeholder for AI Career Coach API service
 * Will handle chat messages and AI completions
 */
export class CoachService {
  static async sendMessage(message: string, context?: any) {
    // throw new Error('Not implemented');
    return {
      text: "This is a placeholder response.",
      suggestions: [],
    };
  }

  static async getConversationHistory(sessionId: string) {
    // throw new Error('Not implemented');
    return [];
  }
}
