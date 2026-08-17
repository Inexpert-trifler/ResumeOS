import { NextResponse } from "next/server";
import { readAiImprovementCache, writeAiImprovementCache } from "@/services/ai/cache";
import { requestGroqImprovement } from "@/services/ai/groq";
import { AiImprovementRequestSchema } from "@/services/ai/types";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = AiImprovementRequestSchema.parse(body);
    const cacheKey = payload;

    const cached = readAiImprovementCache(cacheKey);
    if (cached) {
      return NextResponse.json(cached, { status: 200, headers: { "Cache-Control": "no-store" } });
    }

    const improved = await requestGroqImprovement(payload);
    writeAiImprovementCache(cacheKey, improved);

    return NextResponse.json(improved, {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to improve this section right now.";
    const status = message.toLowerCase().includes("missing groq api key") ? 500 : 400;

    return NextResponse.json(
      {
        error: message,
      },
      { status }
    );
  }
}

