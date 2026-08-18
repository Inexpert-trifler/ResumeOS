import type { AiImprovementRequest, AiImprovementResponse } from "./types";

const CACHE_PREFIX = "resumeos:ai-improve:";
const CACHE_VERSION = 1;
const DEFAULT_TTL_MS = 1000 * 60 * 60 * 24 * 3;

type CachedEntry = {
  expiresAt: number;
  value: AiImprovementResponse;
};

type MemoryCacheStore = Map<string, CachedEntry>;

function getMemoryCache(): MemoryCacheStore {
  const globalScope = globalThis as typeof globalThis & {
    __resumeosAiImprovementCache?: MemoryCacheStore;
  };

  if (!globalScope.__resumeosAiImprovementCache) {
    globalScope.__resumeosAiImprovementCache = new Map<string, CachedEntry>();
  }

  return globalScope.__resumeosAiImprovementCache!;
}

function hashString(value: string): string {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
}

export function createAiImprovementCacheKey(request: AiImprovementRequest): string {
  return `${CACHE_PREFIX}${hashString(
    JSON.stringify({
      version: CACHE_VERSION,
      sectionType: request.sectionType,
      targetField: request.targetField,
      originalText: request.originalText,
      context: request.context ?? null,
      targetRole: request.targetRole ?? null,
      targetCompany: request.targetCompany ?? null,
      fieldLabel: request.fieldLabel ?? null,
      userInstruction: request.userInstruction ?? null,
      tone: request.tone ?? null,
      length: request.length ?? null,
      builderContext: request.builderContext ?? null,
      resumeContext: request.resumeContext ?? null,
    })
  )}`;
}

export function readAiImprovementCache(requestOrKey: AiImprovementRequest | string): AiImprovementResponse | null {
  const cacheKey = typeof requestOrKey === "string" ? requestOrKey : createAiImprovementCacheKey(requestOrKey);
  const now = Date.now();

  if (typeof window !== "undefined") {
    try {
      const stored = window.localStorage.getItem(cacheKey);
      if (!stored) return null;

      const parsed = JSON.parse(stored) as CachedEntry;
      if (!parsed?.value || typeof parsed.expiresAt !== "number" || parsed.expiresAt <= now) {
        window.localStorage.removeItem(cacheKey);
        return null;
      }

      return parsed.value;
    } catch {
      return null;
    }
  }

  const entry = getMemoryCache().get(cacheKey);
  if (!entry || entry.expiresAt <= now) {
    getMemoryCache().delete(cacheKey);
    return null;
  }

  return entry.value;
}

export function writeAiImprovementCache(
  requestOrKey: AiImprovementRequest | string,
  value: AiImprovementResponse,
  ttlMs = DEFAULT_TTL_MS
): void {
  const cacheKey = typeof requestOrKey === "string" ? requestOrKey : createAiImprovementCacheKey(requestOrKey);
  const entry: CachedEntry = {
    value,
    expiresAt: Date.now() + ttlMs,
  };

  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(cacheKey, JSON.stringify(entry));
    } catch {
      // Ignore quota / storage errors.
    }
    return;
  }

  getMemoryCache().set(cacheKey, entry);
}
