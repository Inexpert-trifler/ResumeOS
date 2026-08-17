import { ACTION_VERBS, GENERIC_PHRASES, WEAK_VERBS } from "./rules";

export function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, Math.round(value)));
}

export function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[^a-z0-9+/.\s-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function countWords(value: string): number {
  const trimmed = value.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

export function countSentences(value: string): number {
  const trimmed = value.trim();
  if (!trimmed) return 0;
  return Math.max(1, trimmed.split(/[.!?]+/).map((part) => part.trim()).filter(Boolean).length);
}

export function hasMetric(value: string): boolean {
  return /(\b\d+(\.\d+)?%?\b|\$\d+|\b\d+k\+\b|\b\d+m\+\b|\b\d+x\b)/i.test(value);
}

export function hasStrongVerb(value: string): boolean {
  const text = normalize(value);
  return ACTION_VERBS.some((verb) => text.includes(verb));
}

export function hasWeakVerb(value: string): boolean {
  const text = normalize(value);
  return WEAK_VERBS.some((verb) => text.includes(verb));
}

export function hasGenericPhrase(value: string): boolean {
  const text = normalize(value);
  return GENERIC_PHRASES.some((phrase) => text.includes(phrase));
}

export function uniqueStrings(values: string[]): string[] {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

export function formatPercent(score: number): string {
  return `${clamp(score)}%`;
}

export function titleCase(value: string): string {
  return value
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function parseYear(value: string): number | null {
  const match = value.match(/\b(19|20)\d{2}\b/);
  return match ? Number(match[0]) : null;
}

export function extractNumbers(value: string): number[] {
  return Array.from(value.matchAll(/\b\d+(?:\.\d+)?\b/g)).map((match) => Number(match[0]));
}

export function scoreLabel(score: number): string {
  if (score >= 90) return "Excellent";
  if (score >= 75) return "Good";
  if (score >= 60) return "Fair";
  return "Needs Work";
}

export function statusFromScore(score: number): string {
  if (score >= 95) return "Perfect";
  if (score >= 90) return "Excellent";
  if (score >= 75) return "Good";
  return "Needs Work";
}

export function bucketFromScore(score: number): "excellent" | "good" | "needs-work" | "perfect" {
  if (score >= 97) return "perfect";
  if (score >= 90) return "excellent";
  if (score >= 75) return "good";
  return "needs-work";
}

export function scoreStatus(score: number): string {
  if (score >= 90) return "Excellent";
  if (score >= 75) return "Good";
  if (score >= 60) return "Needs Work";
  return "Poor";
}

export function keepTop(values: string[], limit: number): string[] {
  return uniqueStrings(values).slice(0, limit);
}

export function shortList(values: string[], limit: number): string {
  return keepTop(values, limit).join(", ");
}
