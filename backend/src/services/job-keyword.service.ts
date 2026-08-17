/**
 * Job Keyword Service
 * Categorizes, weights, and deduplicates extracted keywords.
 */

import type { ParsedJobData } from "./job-parser.service";

export type KeywordCategory = "required" | "preferred" | "optional";
export type KeywordType =
  | "technical" | "soft" | "action" | "ats"
  | "tool" | "language" | "framework" | "database" | "cloud";

export interface ProcessedKeyword {
  keyword: string;
  category: KeywordCategory;
  keywordType: KeywordType;
  frequency: number;
  weight: number; // 0–100
}

// Patterns that signal a keyword is REQUIRED (strong obligation language)
const REQUIRED_SIGNALS = [
  /\brequired\b/i,
  /\bmust\s+(have|possess|be)\b/i,
  /\bessential\b/i,
  /\bmandatory\b/i,
  /\bnecessary\b/i,
  /\bexpected\b/i,
  /\bqualification.*?required\b/i,
  /\bminimum\s+qualifications?\b/i,
  /\brequirements?\s*:/i,
  /\byou\s+(will|must|need\s+to)\b/i,
];

// Patterns that signal a keyword is PREFERRED (soft desire language)
const PREFERRED_SIGNALS = [
  /\bpreferred\b/i,
  /\bnice\s+to\s+have\b/i,
  /\bbonus\b/i,
  /\ba\s+plus\b/i,
  /\bdesirable\b/i,
  /\bwould\s+be\s+(a\s+plus|great|helpful)\b/i,
  /\bideally\b/i,
  /\bwelcome\b/i,
  /\boptional\b/i,
  /\bprefer.*?experience\b/i,
  /\bfamiliar(ity)?\s+with\b/i,
  /\bexposure\s+to\b/i,
  /\bknowledge\s+of\b/i,
];

export class JobKeywordService {
  /**
   * Convert a ParsedJobData into categorized, weighted ProcessedKeyword[].
   * Detects duplicates, deduplicates, and normalizes.
   */
  processKeywords(parsed: ParsedJobData, rawText: string): ProcessedKeyword[] {
    const seen = new Map<string, ProcessedKeyword>();

    const add = (
      keyword: string,
      keywordType: KeywordType,
      baseWeight: number,
    ) => {
      const key = keyword.toLowerCase().trim();
      if (!key || key.length < 2) return;

      const existing = seen.get(key);
      const category = this.classifyCategory(rawText, key);
      const frequency = this.countFrequency(rawText, key);
      const weight = this.calculateWeight(baseWeight, category, frequency);

      if (existing) {
        // Keep the higher weight version; merge frequency
        if (weight > existing.weight) {
          seen.set(key, { ...existing, category, frequency: existing.frequency + frequency, weight });
        } else {
          seen.set(key, { ...existing, frequency: existing.frequency + frequency });
        }
      } else {
        seen.set(key, { keyword: key, category, keywordType, frequency, weight });
      }
    };

    // Assign type-specific base weights
    for (const kw of parsed.programmingLanguages) add(kw, "language", 85);
    for (const kw of parsed.frameworks)           add(kw, "framework", 80);
    for (const kw of parsed.databases)            add(kw, "database", 75);
    for (const kw of parsed.cloudPlatforms)       add(kw, "cloud", 70);
    for (const kw of parsed.tools)                add(kw, "tool", 65);
    for (const kw of parsed.technicalSkills)      add(kw, "technical", 60);
    for (const kw of parsed.softSkills)           add(kw, "soft", 50);
    for (const kw of parsed.actionVerbs)          add(kw, "action", 40);
    for (const kw of parsed.atsKeywords)          add(kw, "ats", 55);

    return Array.from(seen.values())
      .sort((a, b) => b.weight - a.weight);
  }

  private classifyCategory(rawText: string, keyword: string): KeywordCategory {
    // Find context window (±200 chars) around each occurrence of the keyword
    const lowerText = rawText.toLowerCase();
    const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(escaped, "gi");
    let match;
    const contexts: string[] = [];

    while ((match = regex.exec(lowerText)) !== null) {
      const start = Math.max(0, match.index - 200);
      const end = Math.min(lowerText.length, match.index + 200);
      contexts.push(lowerText.slice(start, end));
    }

    if (contexts.length === 0) return "optional";

    let requiredScore = 0;
    let preferredScore = 0;

    for (const ctx of contexts) {
      for (const sig of REQUIRED_SIGNALS) {
        if (sig.test(ctx)) requiredScore++;
      }
      for (const sig of PREFERRED_SIGNALS) {
        if (sig.test(ctx)) preferredScore++;
      }
    }

    if (requiredScore > preferredScore) return "required";
    if (preferredScore > 0) return "preferred";
    // Default: if no signals, assume required for technical keywords
    return "optional";
  }

  private countFrequency(rawText: string, keyword: string): number {
    const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`\\b${escaped}\\b`, "gi");
    return (rawText.match(regex) ?? []).length;
  }

  private calculateWeight(
    baseWeight: number,
    category: KeywordCategory,
    frequency: number,
  ): number {
    const categoryMultiplier =
      category === "required" ? 1.2 :
      category === "preferred" ? 1.0 :
      0.7;

    const freqBonus = Math.min(frequency * 5, 20);
    const raw = baseWeight * categoryMultiplier + freqBonus;
    return Math.min(100, Math.round(raw));
  }
}
