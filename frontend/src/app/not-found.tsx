export const dynamic = 'force-dynamic';

import Link from "next/link";
import { Home, LayoutDashboard, ArrowLeft, Sparkles } from "lucide-react";
import { Logo } from "@/components/shared/Logo";

/**
 * Custom 404 page.
 * Uses CSS animations instead of framer-motion to avoid Turbopack SSR crashes.
 * framer-motion calls useMemo during module initialization, which fails in the
 * server-side prerender of special Next.js pages like _not-found.
 */
export default function NotFound() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-background overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-accent/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]" />

      <style>{`
        @keyframes nf-fade-scale { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }
        @keyframes nf-slide-down  { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes nf-slide-up    { from { opacity: 0; transform: translateY(10px);  } to { opacity: 1; transform: translateY(0); } }
        @keyframes nf-fade        { from { opacity: 0; } to { opacity: 1; } }
        .nf-logo    { animation: nf-fade-scale 0.5s cubic-bezier(0.34,1.56,0.64,1) both; }
        .nf-number  { animation: nf-slide-down 0.5s cubic-bezier(0.21,0.47,0.32,0.98) both; }
        .nf-heading { animation: nf-slide-up 0.5s ease both 0.15s; }
        .nf-desc    { animation: nf-slide-up 0.5s ease both 0.2s; }
        .nf-actions { animation: nf-slide-up 0.5s ease both 0.28s; }
        .nf-back    { animation: nf-fade 0.5s ease both 0.4s; }
      `}</style>

      <div className="relative z-10 text-center px-6 max-w-xl mx-auto">
        {/* Logo mark */}
        <div className="nf-logo flex items-center justify-center mb-8">
          <Link href="/" className="flex items-center gap-2">
            <Logo size="lg" className="shadow-lg shadow-accent/20 rounded-xl" />
          </Link>
        </div>

        {/* 404 Number */}
        <div className="nf-number mb-6">
          <span className="text-[120px] md:text-[160px] font-bold tracking-tighter leading-none bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/20 select-none">
            404
          </span>
        </div>

        {/* Heading */}
        <h1 className="nf-heading text-2xl md:text-3xl font-bold tracking-tight mb-4">
          Page not found
        </h1>

        {/* Description */}
        <p className="nf-desc text-muted-foreground text-lg leading-relaxed mb-10">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        {/* Actions */}
        <div className="nf-actions flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/" className="inline-flex items-center justify-center rounded-full px-8 h-12 gap-2 bg-accent text-white font-medium shadow-lg shadow-accent/10 hover:bg-accent/90 transition-colors">
            <Home className="w-4 h-4" />
            Go Home
          </Link>
          <Link href="/dashboard" className="inline-flex items-center justify-center rounded-full px-8 h-12 gap-2 border border-border/50 bg-background hover:bg-muted text-foreground font-medium transition-colors">
            <LayoutDashboard className="w-4 h-4" />
            Open Dashboard
          </Link>
        </div>

        {/* Back link */}
        <div className="nf-back mt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
