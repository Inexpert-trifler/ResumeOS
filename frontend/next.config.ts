import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  allowedDevOrigins: ["192.168.29.219"],
  // Exclude @base-ui/react from the server bundle.
  // It calls useContext during module initialization which crashes Turbopack SSR.
  // All components using it are "use client" and are safely hydrated on the client.
  serverExternalPackages: ["@base-ui/react"],
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "@dnd-kit/core",
      "@dnd-kit/sortable",
    ],
  },
};

export default nextConfig;

