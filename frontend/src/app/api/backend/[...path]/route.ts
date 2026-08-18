import { NextResponse } from "next/server";

export const runtime = "nodejs";

const BACKEND_API_URL = (
  process.env.BACKEND_INTERNAL_URL ||
  "http://localhost:4000/api"
).replace(/\/$/, "");

const HOP_BY_HOP_HEADERS = new Set([
  "connection",
  "content-length",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
  "accept-encoding",
  "host",
]);

async function proxyRequest(request: Request, pathSegments: string[]) {
  const path = pathSegments
    .filter((segment) => segment && segment !== "." && segment !== "..")
    .join("/");
  const targetUrl = new URL(`${BACKEND_API_URL}/${path}${new URL(request.url).search}`);

  const headers = new Headers(request.headers);
  for (const headerName of HOP_BY_HOP_HEADERS) {
    headers.delete(headerName);
  }

  const hasBody = request.method !== "GET" && request.method !== "HEAD";
  const body = hasBody ? await request.arrayBuffer() : undefined;

  try {
    const controller = new AbortController();
    const timeout = globalThis.setTimeout(() => controller.abort("Upstream backend timed out."), 25000);

    const backendResponse = await fetch(targetUrl, {
      method: request.method,
      headers,
      body,
      cache: "no-store",
      redirect: "manual",
      signal: controller.signal,
    });

    globalThis.clearTimeout(timeout);

    const responseHeaders = new Headers();
    for (const [key, value] of backendResponse.headers.entries()) {
      if (!HOP_BY_HOP_HEADERS.has(key.toLowerCase())) {
        responseHeaders.set(key, value);
      }
    }
    responseHeaders.set("Cache-Control", "no-store");

    if (backendResponse.status === 204) {
      return new NextResponse(null, { status: 204, headers: responseHeaders });
    }

    const responseBody = await backendResponse.arrayBuffer();
    return new NextResponse(responseBody, {
      status: backendResponse.status,
      headers: responseHeaders,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to reach backend service.";
    const status = message.toLowerCase().includes("timed out") ? 504 : 502;
    return NextResponse.json(
      {
        success: false,
        error: {
          code: status === 504 ? "BACKEND_TIMEOUT" : "BACKEND_UNAVAILABLE",
          message,
        },
      },
      { status }
    );
  }
}

export async function GET(request: Request, context: { params: Promise<{ path?: string[] }> }) {
  const { path = [] } = await context.params;
  return proxyRequest(request, path);
}

export async function POST(request: Request, context: { params: Promise<{ path?: string[] }> }) {
  const { path = [] } = await context.params;
  return proxyRequest(request, path);
}

export async function PUT(request: Request, context: { params: Promise<{ path?: string[] }> }) {
  const { path = [] } = await context.params;
  return proxyRequest(request, path);
}

export async function PATCH(request: Request, context: { params: Promise<{ path?: string[] }> }) {
  const { path = [] } = await context.params;
  return proxyRequest(request, path);
}

export async function DELETE(request: Request, context: { params: Promise<{ path?: string[] }> }) {
  const { path = [] } = await context.params;
  return proxyRequest(request, path);
}

export async function OPTIONS(request: Request, context: { params: Promise<{ path?: string[] }> }) {
  const { path = [] } = await context.params;
  return proxyRequest(request, path);
}
