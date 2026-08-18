export function getApiBaseUrl(): string {
  if (typeof window !== "undefined") {
    return "/api/backend";
  }

  return (
    process.env.BACKEND_INTERNAL_URL ??
    "https://resumeos-j2u9.onrender.com/api"
  ).replace(/\/$/, "");
}
