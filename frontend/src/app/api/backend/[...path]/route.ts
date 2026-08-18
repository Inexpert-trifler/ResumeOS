import { NextResponse } from "next/server";

export const runtime = "nodejs";

const BACKEND_API_URL = (
  process.env.BACKEND_INTERNAL_URL ||
  "https://resumeos-j2u9.onrender.com/api"
).replace(/\/$/, "");

const HOP_BY_HOP_HEADERS = new Set([
  "connection",
  "content-length",
  "content-encoding",
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

const RESPONSE_HEADERS_TO_DROP = new Set([
  "content-length",
  "content-encoding",
  "transfer-encoding",
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "upgrade",
]);

function isBinaryContentType(contentType: string): boolean {
  return /^(application\/pdf|image\/|audio\/|video\/|application\/octet-stream|font\/|application\/zip)/i.test(contentType);
}

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
      if (!RESPONSE_HEADERS_TO_DROP.has(key.toLowerCase())) {
        responseHeaders.set(key, value);
      }
    }
    responseHeaders.set("Cache-Control", "no-store, no-transform");
    responseHeaders.set("Content-Encoding", "identity");
    responseHeaders.set("Vary", "Origin");

    if (backendResponse.status === 204) {
      return new NextResponse(null, { status: 204, headers: responseHeaders });
    }

    const contentType = backendResponse.headers.get("content-type") || "";
    if (isBinaryContentType(contentType)) {
      const responseBody = await backendResponse.arrayBuffer();
      const binaryHeaders = new Headers(responseHeaders);
      binaryHeaders.set("Content-Type", contentType);
      return new NextResponse(responseBody, {
        status: backendResponse.status,
        headers: binaryHeaders,
      });
    }

    const responseText = await backendResponse.text();

    if (contentType.includes("application/json") || responseText.trim().startsWith("{") || responseText.trim().startsWith("[")) {
      try {
        const parsed = JSON.parse(responseText);
        const jsonHeaders = new Headers(responseHeaders);
        jsonHeaders.delete("content-type");
        return NextResponse.json(parsed, {
          status: backendResponse.status,
          headers: jsonHeaders,
        });
      } catch {
        // Fall through to raw text below when the payload is not valid JSON.
      }
    }

    return new NextResponse(responseText, {
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
