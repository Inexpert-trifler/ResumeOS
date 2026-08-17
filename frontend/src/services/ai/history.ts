const AI_HISTORY_KEY = "resumeos:ai-history";

export interface AiHistoryRecord {
  section: string;
  originalText: string;
  improvedText: string;
  timestamp: string;
}

function readRecords(): AiHistoryRecord[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(AI_HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as AiHistoryRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function readAiHistory(): AiHistoryRecord[] {
  return readRecords();
}

export function appendAiHistoryRecord(record: AiHistoryRecord): AiHistoryRecord[] {
  if (typeof window === "undefined") return [record];

  const next = [...readRecords(), record].slice(-100);
  try {
    window.localStorage.setItem(AI_HISTORY_KEY, JSON.stringify(next));
  } catch {
    // Ignore storage errors.
  }
  return next;
}

