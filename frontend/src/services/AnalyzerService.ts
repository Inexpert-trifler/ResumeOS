/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Placeholder for Analyzer API service
 * Will handle ATS scoring and keyword extraction
 */
export class AnalyzerService {
  static async analyzeResume(_fileOrData: unknown) {
    // throw new Error('Not implemented');
    return {
      score: 0,
      keywords: [] as string[],
      suggestions: [] as string[],
    };
  }

  static async getKeywordSuggestions(_jobDescription: string) {
    // throw new Error('Not implemented');
    return [] as string[];
  }
}
