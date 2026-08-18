"use client";

/**
 * Global Error Boundary — Next.js App Router
 *
 * This file is required to override Next.js's built-in /_global-error default,
 * which tries to render the root layout (including @base-ui/react TooltipProvider)
 * during static prerendering. That causes a "Cannot read properties of null
 * (reading 'useContext')" crash in Turbopack production builds.
 *
 * Per Next.js docs, global-error.tsx must supply its own <html> and <body>
 * because it replaces the entire root layout when active.
 */
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0a",
          color: "#fafafa",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.75rem" }}>
            Something went wrong
          </h1>
          <p style={{ color: "#a1a1aa", marginBottom: "1.5rem" }}>
            An unexpected error occurred. Please try refreshing the page.
          </p>
          <button
            onClick={reset}
            style={{
              background: "#6366f1",
              color: "#fff",
              border: "none",
              borderRadius: "9999px",
              padding: "0.6rem 1.5rem",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "0.875rem",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
