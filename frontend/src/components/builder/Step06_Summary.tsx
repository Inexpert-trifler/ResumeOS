"use client";

import { StepWrapper } from "./StepWrapper";
import { BuilderAiAssistant } from "./BuilderAiAssistant";
import { BuilderState } from '@/types';
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Lightbulb } from "lucide-react";

const EXAMPLES = [
  "Software Engineer with 4+ years building scalable APIs in Node.js. Led migration to microservices, cutting latency by 40%. Passionate about clean code and developer experience.",
  "Frontend Developer specializing in React and Next.js. Built 10+ production apps, including an e-commerce platform serving 50K+ users. Focused on performance and accessibility.",
];

const TIPS = [
  "Start with your title and years of experience",
  "Include one major, quantified achievement",
  "Keep it 2-3 sentences max",
  "Write in third-person perspective",
];

function getStrength(text: string): { label: string; color: string; pct: number } {
  const len = text.trim().length;
  if (len < 50) return { label: "Needs Work", color: "bg-destructive", pct: 15 };
  if (len < 100) return { label: "Getting There", color: "bg-orange-500", pct: 40 };
  if (len < 200) return { label: "Good", color: "bg-yellow-500", pct: 70 };
  if (len < 400) return { label: "Excellent!", color: "bg-green-500", pct: 95 };
  return { label: "Too Long", color: "bg-destructive", pct: 100 };
}

interface Step06Props {
  state: BuilderState;
  update: (partial: Partial<BuilderState>) => void;
}

export function Step06_Summary({ state, update }: Step06Props) {
  const strength = getStrength(state.summary);
  const charCount = state.summary.length;
  const MAX_CHARS = 500;

  return (
    <StepWrapper
      badge="Step 6"
      title="Write your professional summary"
      description="This is the first thing recruiters read. Make it count."
      actions={
        <BuilderAiAssistant
          sectionType="summary"
          targetField="summary"
          fieldLabel="Professional Summary"
          currentText={state.summary}
          onApply={(nextText) => update({ summary: nextText })}
          targetRole={state.targetRole}
          builderContext={{
            careerGoal: state.careerGoal,
            experienceLevel: state.experienceLevel,
            targetRole: state.targetRole,
            skills: state.skills.map((skill) => skill.name),
            experienceCount: state.experience.length,
            projectCount: state.projects.length,
          }}
          userInstruction="Create a concise, recruiter-ready summary that reflects the user's current goals and experience."
          allowInsert={false}
        />
      }
    >
      <div className="max-w-2xl space-y-5">
        {/* Main Textarea */}
        <div>
          <textarea
            value={state.summary}
            onChange={(e) => update({ summary: e.target.value })}
            maxLength={MAX_CHARS}
            rows={5}
            placeholder="Software Engineer with X years of experience in... Led / Built / Architected..."
            className={cn(
              "w-full p-4 rounded-xl border border-border/50 bg-card text-sm text-foreground",
              "resize-none placeholder:text-muted-foreground",
              "focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
            )}
          />
          <div className="flex items-center justify-between mt-2 px-1">
            <span className={cn("text-xs", charCount > MAX_CHARS * 0.8 ? "text-orange-500" : "text-muted-foreground")}>
              {charCount} / {MAX_CHARS}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Strength:</span>
              <span className={cn("text-xs font-bold", strength.pct > 70 ? "text-green-500" : "text-orange-500")}>
                {strength.label}
              </span>
            </div>
          </div>
        </div>

        {/* Strength Bar */}
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <motion.div
            className={cn("h-full rounded-full", strength.color)}
            animate={{ width: `${strength.pct}%` }}
            transition={{ type: "spring", stiffness: 80 }}
          />
        </div>

        {/* Writing Tips */}
        <div className="bg-muted/50 rounded-xl p-4 border border-border/50">
          <h4 className="font-semibold text-sm flex items-center gap-2 mb-3">
            <Lightbulb className="w-4 h-4 text-accent" /> Writing Tips
          </h4>
          <ul className="space-y-1.5">
            {TIPS.map((tip, i) => (
              <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                <span className="text-accent font-bold mt-0.5">→</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>

        {/* Examples */}
        <div>
          <h4 className="font-semibold text-sm mb-3 text-muted-foreground">Example summaries:</h4>
          <div className="space-y-3">
            {EXAMPLES.map((ex, i) => (
              <button
                key={i}
                onClick={() => update({ summary: ex })}
                className="w-full text-left p-4 rounded-xl border border-border/50 bg-card text-sm text-muted-foreground hover:border-accent/50 hover:text-foreground hover:bg-muted/50 transition-all group"
              >
                <span className="text-accent text-xs font-bold uppercase block mb-1 group-hover:underline">
                  Use this example →
                </span>
                <q className="italic">{ex}</q>
              </button>
            ))}
          </div>
        </div>
      </div>
    </StepWrapper>
  );
}
