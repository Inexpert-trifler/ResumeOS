import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  allowedDevOrigins: ["192.168.29.219"],
  experimental: {
    optimizePackageImports: [
      "framer-motion",
      "lucide-react",
      "recharts",
      "@dnd-kit/core",
      "@dnd-kit/sortable",
    ],
  },
  // Sprint 2 placeholder: serverExternalPackages for future AI/PDF libs
  // serverExternalPackages: [],
};

export default nextConfig;
