import { createAiImprovementCacheKey, readAiImprovementCache, writeAiImprovementCache } from "./cache";
import { AiImprovementRequestSchema, AiImprovementResponseSchema } from "./types";
import type { AiImprovementRequest, AiImprovementResponse } from "./types";

export type {
  AiImprovementRequest,
  AiImprovementResponse,
  AiImprovementTone,
  AiImprovementLength,
  AiImprovementSectionType,
  AiImprovementTargetField,
} from "./types";
export { aiImprovementTones, aiImprovementLengths } from "./types";

export interface RequestAiImprovementOptions {
  signal?: AbortSignal;
  timeoutMs?: number;
}

let tokenProvider: (() => Promise<string | null>) | null = null;

export function configureAiTokenProvider(provider: (() => Promise<string | null>) | null) {
  tokenProvider = provider;
}

function timeoutMessage(timeoutMs: number): string {
  return `The request timed out after ${Math.round(timeoutMs / 1000)} seconds.`;
}

export async function requestAiImprovement(
  request: AiImprovementRequest,
  options: RequestAiImprovementOptions = {}
): Promise<AiImprovementResponse> {
  const normalizedRequest = AiImprovementRequestSchema.parse(request);
  const cacheKey = createAiImprovementCacheKey(normalizedRequest);

  const cached = readAiImprovementCache(cacheKey);
  if (cached) {
    return cached;
  }

  const timeoutMs = options.timeoutMs ?? 45000;
  const controller = new AbortController();
  const handleAbort = () => controller.abort(options.signal?.reason);
  const timer = globalThis.setTimeout(() => controller.abort(timeoutMessage(timeoutMs)), timeoutMs);

  if (options.signal) {
    if (options.signal.aborted) {
      globalThis.clearTimeout(timer);
      throw new Error("The request was cancelled.");
    }
    options.signal.addEventListener("abort", handleAbort, { once: true });
  }

  try {
    const token = await tokenProvider?.();

    const response = await fetch("/api/ai/improve", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(normalizedRequest),
      signal: controller.signal,
    });

    const payload = await response.json().catch(() => null);
    if (!response.ok) {
      const rawMessage = payload?.error?.message || payload?.error || payload?.message || "We couldn't generate an AI suggestion right now.";
      const friendlyMessage =
        response.status === 429 || /rate limit/i.test(rawMessage)
          ? "Groq is temporarily rate-limited. Please try again in a moment."
          : response.status === 408 || /timed out/i.test(rawMessage)
            ? timeoutMessage(timeoutMs)
            : rawMessage;
      throw new Error(friendlyMessage);
    }

    const parsed = AiImprovementResponseSchema.parse(payload);
    writeAiImprovementCache(cacheKey, parsed);
    return parsed;
  } catch (error) {
    if (controller.signal.aborted) {
      const reason = controller.signal.reason;
      throw new Error(typeof reason === "string" ? reason : "The request was cancelled.");
    }

    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("The request was cancelled.");
    }

    throw new Error(error instanceof Error ? error.message : "Invalid AI response.");
  } finally {
    globalThis.clearTimeout(timer);
    if (options.signal) {
      options.signal.removeEventListener("abort", handleAbort);
    }
  }
}
