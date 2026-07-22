"use client";

import { motion } from "framer-motion";
import { Sparkles, Clock, CheckCircle2, ArrowRight } from "lucide-react";

interface BuilderWelcomeScreenProps {
  onStart: () => void;
}

const FEATURES = [
  { icon: "🧠", text: "AI-assisted writing prompts for every section" },
  { icon: "✅", text: "Live ATS compatibility checker as you build" },
  { icon: "📊", text: "Real-time resume strength scoring" },
  { icon: "💾", text: "Auto-saved as you type — no data lost" },
];

export function BuilderWelcomeScreen({ onStart }: BuilderWelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", bounce: 0.4 }}
          className="w-20 h-20 rounded-3xl bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto mb-8 shadow-lg shadow-accent/10"
        >
          <Sparkles className="w-10 h-10 text-accent" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-bold tracking-tight mb-4"
        >
          Build your perfect<br />
          <span className="text-accent">resume in 16 steps.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-muted-foreground mb-8"
        >
          This isn't a form. It's a guided career coaching session. 
          Answer each question honestly and we'll do the heavy lifting.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center gap-2 mb-10 text-sm text-muted-foreground"
        >
          <Clock className="w-4 h-4" />
          Estimated time: 15–30 minutes · Auto-saved throughout
        </motion.div>

        {/* Feature List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card border border-border/50 rounded-2xl p-6 text-left mb-8 shadow-sm space-y-3"
        >
          {FEATURES.map((f, i) => (
            <div key={i} className="flex items-center gap-3 text-sm">
              <span className="text-base">{f.icon}</span>
              <span className="text-muted-foreground">{f.text}</span>
            </div>
          ))}
        </motion.div>

        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: "spring", bounce: 0.4 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onStart}
          className="w-full h-14 bg-foreground text-background rounded-2xl text-base font-bold shadow-xl flex items-center justify-center gap-3 hover:opacity-90 transition-opacity"
        >
          Start Building My Resume
          <ArrowRight className="w-5 h-5" />
        </motion.button>

        <p className="text-xs text-muted-foreground mt-4">
          No account required. Your data stays in your browser.
        </p>
      </div>
    </div>
  );
}
