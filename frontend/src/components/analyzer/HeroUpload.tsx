"use client";

import { motion } from "framer-motion";
import { UploadCloud, FileText, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AnalyzerHeroUpload() {
  return (
    <section className="mb-12">
      {/* Header */}
      <div className="text-center mb-8">
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-5xl font-bold tracking-tight mb-4"
        >
          Resume <span className="text-accent">Analyzer</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground text-lg max-w-2xl mx-auto"
        >
          Upload your resume and receive a complete professional analysis. Identify weak spots, optimize for ATS, and impress recruiters.
        </motion.p>
      </div>

      {/* Upload Area */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="max-w-3xl mx-auto"
      >
        <div className="relative group p-12 rounded-3xl border-2 border-dashed border-border/60 hover:border-accent/50 bg-card hover:bg-accent/5 transition-all flex flex-col items-center justify-center text-center overflow-hidden cursor-pointer">
          {/* Abstract background blobs for premium feel */}
          <div className="absolute -top-20 -left-20 w-48 h-48 bg-accent/10 rounded-full blur-3xl group-hover:bg-accent/20 transition-colors pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-colors pointer-events-none" />

          <div className="w-16 h-16 mb-6 rounded-2xl bg-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <UploadCloud className="w-8 h-8 text-accent" />
          </div>
          
          <h3 className="text-xl font-bold mb-2">Drag & Drop your Resume</h3>
          <p className="text-sm text-muted-foreground mb-6">Supported formats: PDF, DOCX (Max 5MB)</p>
          
          <div className="flex items-center gap-4 relative z-10">
            <Button size="lg" className="rounded-full shadow-lg shadow-accent/20">
              Upload Resume
            </Button>
            <span className="text-muted-foreground text-sm">or</span>
            <Button variant="outline" size="lg" className="rounded-full bg-background/50 backdrop-blur">
              Use Demo Resume
            </Button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
