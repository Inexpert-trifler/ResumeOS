/**
 * Placeholder for Analyzer API service
 * Will handle ATS scoring and keyword extraction
 */
export class AnalyzerService {
  static async analyzeResume(fileOrData: any) {
    // throw new Error('Not implemented');
    return {
      score: 0,
      keywords: [],
      suggestions: [],
    };
  }

  static async getKeywordSuggestions(jobDescription: string) {
    // throw new Error('Not implemented');
    return [];
  }
}
