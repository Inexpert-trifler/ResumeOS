import { NextResponse } from "next/server";

export const runtime = "nodejs";

const BACKEND_API_URL = process.env.BACKEND_INTERNAL_URL || "http://localhost:4000/api";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const authHeader = request.headers.get("authorization");

    const response = await fetch(`${BACKEND_API_URL}/ai/improve`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const payload = await response.json();
    return NextResponse.json(payload, {
      status: response.status,
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to reach Express AI service.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
