export function getApiBaseUrl(): string {
  if (typeof window !== "undefined") {
    return "/api/backend";
  }

  return (process.env.BACKEND_INTERNAL_URL ?? "http://localhost:4000/api").replace(/\/$/, "");
}
