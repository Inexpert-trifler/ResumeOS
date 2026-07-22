"use client";

import { StepWrapper } from "./StepWrapper";
import { BuilderState } from '@/types';
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, User, Briefcase, BookOpen, Trophy, Globe, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReviewSection {
  icon: React.ElementType;
  title: string;
  content: React.ReactNode;
  step: number;
}

interface Step16Props {
  state: BuilderState;
  onGoToStep: (step: number) => void;
  onGenerate: () => void;
}

export function Step16_Review({ state, onGoToStep, onGenerate }: Step16Props) {
  const p = state.personalInfo;

  const sections: ReviewSection[] = [
    {
      icon: User, title: "Personal Info", step: 4,
      content: (
        <div className="text-sm text-muted-foreground space-y-0.5">
          <p className="text-foreground font-semibold">{p.firstName} {p.lastName}</p>
          {p.email && <p>{p.email}</p>}
          {p.location && <p>{p.location}</p>}
          {p.linkedin && <p className="truncate">{p.linkedin}</p>}
        </div>
      )
    },
    {
      icon: Briefcase, title: "Career Context", step: 0,
      content: (
        <div className="text-sm space-y-1">
          <p><span className="text-muted-foreground">Goal:</span> <strong>{state.careerGoal || "—"}</strong></p>
          <p><span className="text-muted-foreground">Role:</span> <strong>{state.targetRole || "—"}</strong></p>
          <p><span className="text-muted-foreground">Experience:</span> <strong>{state.experienceLevel || "—"}</strong></p>
          {state.targetCompany && <p><span className="text-muted-foreground">Company:</span> <strong>{state.targetCompany}</strong></p>}
        </div>
      )
    },
    {
      icon: Hash, title: "Skills", step: 6,
      content: (
        <div className="flex flex-wrap gap-1.5">
          {state.skills.length === 0 ? <p className="text-sm text-muted-foreground">No skills added yet</p> :
            state.skills.slice(0, 12).map(s => (
              <span key={s.id} className="bg-accent/10 text-accent text-xs px-2 py-1 rounded-full">{s.name}</span>
            ))
          }
          {state.skills.length > 12 && <span className="text-xs text-muted-foreground">+{state.skills.length - 12} more</span>}
        </div>
      )
    },
    {
      icon: Briefcase, title: "Experience", step: 8,
      content: state.experience.length === 0 ? <p className="text-sm text-muted-foreground">No experience added</p> : (
        <div className="space-y-1">
          {state.experience.map(e => <p key={e.id} className="text-sm"><strong>{e.role}</strong> at {e.company}</p>)}
        </div>
      )
    },
    {
      icon: BookOpen, title: "Education", step: 9,
      content: state.education.length === 0 ? <p className="text-sm text-muted-foreground">No education added</p> : (
        <div className="space-y-1">
          {state.education.map(e => <p key={e.id} className="text-sm"><strong>{e.degree}</strong> — {e.institution}</p>)}
        </div>
      )
    },
    {
      icon: Trophy, title: "Achievements & Certs", step: 10,
      content: (
        <p className="text-sm text-muted-foreground">
          {state.achievements.length} achievement{state.achievements.length !== 1 ? "s" : ""} · {state.certificates.length} certificate{state.certificates.length !== 1 ? "s" : ""}
        </p>
      )
    },
    {
      icon: Globe, title: "Languages & Interests", step: 13,
      content: (
        <div className="text-sm text-muted-foreground space-y-1">
          {state.languages.length > 0 && <p>Languages: {state.languages.map(l => l.name).join(", ")}</p>}
          {state.interests.length > 0 && <p>Interests: {state.interests.slice(0, 4).join(", ")}{state.interests.length > 4 ? "..." : ""}</p>}
          {state.languages.length === 0 && state.interests.length === 0 && <p>None added</p>}
        </div>
      )
    },
  ];

  return (
    <StepWrapper
      badge="Step 16 — Final"
      title="Looking great! 🎉"
      description="Here's a summary of everything you've entered. Click any section to edit it."
    >
      <div className="max-w-2xl space-y-4">
        {sections.map((section, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="bg-card border border-border/50 rounded-2xl p-5 shadow-sm group hover:border-accent/30 transition-all"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1">
                <div className="w-8 h-8 rounded-xl bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                  <section.icon className="w-4 h-4 text-accent" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm mb-2 flex items-center gap-2">
                    {section.title}
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                  </p>
                  {section.content}
                </div>
              </div>
              <button
                onClick={() => onGoToStep(section.step)}
                className="shrink-0 text-xs text-muted-foreground hover:text-accent transition-colors opacity-0 group-hover:opacity-100 flex items-center gap-1"
              >
                Edit <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        ))}

        <div className="pt-4">
          <Button onClick={onGenerate} className="w-full h-14 rounded-2xl text-base font-bold shadow-lg gap-3">
            🚀 Generate My Resume
          </Button>
          <p className="text-center text-xs text-muted-foreground mt-3">
            This will take you to the preview page. You can always come back and edit.
          </p>
        </div>
      </div>
    </StepWrapper>
  );
}
