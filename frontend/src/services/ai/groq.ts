import { type AiImprovementRequest, type AiImprovementResponse } from "./types";

/**
 * Legacy frontend Groq entry point — deprecated.
 * All AI interactions are routed securely through server-side endpoints (/api/ai/*)
 * to ensure secrets (GROQ_API_KEY) are never exposed to the client.
 */
export async function requestGroqImprovement(_request: AiImprovementRequest): Promise<AiImprovementResponse> {
  throw new Error("Direct client-side Groq requests are disabled for security. Use server endpoints.");
}
