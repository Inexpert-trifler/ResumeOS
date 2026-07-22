"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, LayoutDashboard, ArrowLeft, Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-background overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-accent/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]" />

      <div className="relative z-10 text-center px-6 max-w-xl mx-auto">
        {/* Logo mark */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="flex items-center justify-center mb-8"
        >
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shadow-lg shadow-accent/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
          </Link>
        </motion.div>

        {/* 404 Number */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="mb-6"
        >
          <span className="text-[120px] md:text-[160px] font-bold tracking-tighter leading-none bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/20 select-none">
            404
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="text-2xl md:text-3xl font-bold tracking-tight mb-4"
        >
          Page not found
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-muted-foreground text-lg leading-relaxed mb-10"
        >
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </motion.p>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Link href="/">
            <Button size="lg" className="rounded-full px-8 h-12 gap-2 shadow-lg shadow-accent/10">
              <Home className="w-4 h-4" />
              Go Home
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" size="lg" className="rounded-full px-8 h-12 gap-2 border-border/50">
              <LayoutDashboard className="w-4 h-4" />
              Open Dashboard
            </Button>
          </Link>
        </motion.div>

        {/* Back link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Go back
          </button>
        </motion.div>
      </div>
    </div>
  );
}
