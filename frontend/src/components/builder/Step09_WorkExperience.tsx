"use client";

import { useState } from "react";
import { StepWrapper } from "./StepWrapper";
import { BuilderState, WorkExperience } from '@/types';
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ChevronDown, ChevronUp, Trash2, Building2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function ExperienceCard({ exp, onUpdate, onDelete }: {
  exp: WorkExperience;
  onUpdate: (e: WorkExperience) => void;
  onDelete: () => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const [respInput, setRespInput] = useState("");
  const [achInput, setAchInput] = useState("");

  const set = (key: keyof WorkExperience) => (v: string | boolean) =>
    onUpdate({ ...exp, [key]: v });

  const addResp = () => {
    if (!respInput.trim()) return;
    onUpdate({ ...exp, responsibilities: [...exp.responsibilities, respInput.trim()] });
    setRespInput("");
  };

  const addAch = () => {
    if (!achInput.trim()) return;
    onUpdate({ ...exp, achievements: [...exp.achievements, achInput.trim()] });
    setAchInput("");
  };

  const labelCls = "block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider";
  const inputCls = "w-full bg-muted/50 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all";

  return (
    <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
      className="relative pl-6 border-l-2 border-accent/30"
    >
      {/* Timeline dot */}
      <div className="absolute -left-2 top-4 w-4 h-4 rounded-full border-2 border-accent bg-background" />

      <div className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm ml-2">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/50 bg-muted/30">
          <div className="flex items-center gap-3">
            <Building2 className="w-4 h-4 text-accent" />
            <div>
              <p className="font-bold text-sm">{exp.role || "Untitled Role"}</p>
              <p className="text-xs text-muted-foreground">{exp.company || "Company"} {exp.startDate ? `· ${exp.startDate}` : ""}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setExpanded(!expanded)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground">
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            <button onClick={onDelete} className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Company *</label>
                    <input value={exp.company} onChange={(e) => set("company")(e.target.value)} placeholder="Google" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Job Title *</label>
                    <input value={exp.role} onChange={(e) => set("role")(e.target.value)} placeholder="Software Engineer" className={inputCls} />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className={labelCls}>Start Date</label>
                    <input type="month" value={exp.startDate} onChange={(e) => set("startDate")(e.target.value)} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>End Date</label>
                    <input type="month" value={exp.endDate} onChange={(e) => set("endDate")(e.target.value)} disabled={exp.current} className={cn(inputCls, exp.current && "opacity-40")} />
                  </div>
                  <div className="flex items-end pb-2">
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="checkbox" checked={exp.current} onChange={(e) => set("current")(e.target.checked)} className="accent-accent w-4 h-4" />
                      <span className="text-muted-foreground">Current</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Location</label>
                  <input value={exp.location} onChange={(e) => set("location")(e.target.value)} placeholder="San Francisco, CA / Remote" className={inputCls} />
                </div>

                {/* Responsibilities */}
                <div>
                  <label className={labelCls}>Key Responsibilities</label>
                  <div className="space-y-1.5 mb-2">
                    {exp.responsibilities.map((r, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm bg-muted/30 rounded-lg px-3 py-2">
                        <span className="text-accent font-bold text-xs mt-0.5">•</span>
                        <span className="flex-1">{r}</span>
                        <button onClick={() => onUpdate({ ...exp, responsibilities: exp.responsibilities.filter((_, idx) => idx !== i) })} className="text-muted-foreground hover:text-destructive mt-0.5">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input value={respInput} onChange={(e) => setRespInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addResp()} placeholder="Built REST APIs..." className={cn(inputCls, "flex-1")} />
                    <button onClick={addResp} className="px-3 py-2 rounded-lg bg-muted text-foreground text-xs font-semibold">+</button>
                  </div>
                </div>

                {/* Achievements */}
                <div>
                  <label className={labelCls}>Quantified Achievements</label>
                  <div className="space-y-1.5 mb-2">
                    {exp.achievements.map((a, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm bg-green-500/5 rounded-lg px-3 py-2 border border-green-500/10">
                        <span className="text-green-500 font-bold text-xs mt-0.5">↑</span>
                        <span className="flex-1">{a}</span>
                        <button onClick={() => onUpdate({ ...exp, achievements: exp.achievements.filter((_, idx) => idx !== i) })} className="text-muted-foreground hover:text-destructive mt-0.5">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input value={achInput} onChange={(e) => setAchInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addAch()} placeholder="Reduced latency by 40%, Increased revenue by $1M..." className={cn(inputCls, "flex-1")} />
                    <button onClick={addAch} className="px-3 py-2 rounded-lg bg-green-500/10 text-green-600 text-xs font-semibold hover:bg-green-500/20">+</button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

interface Step09Props {
  state: BuilderState;
  update: (partial: Partial<BuilderState>) => void;
}

export function Step09_WorkExperience({ state, update }: Step09Props) {
  const addExp = () => {
    const newExp: WorkExperience = {
      id: Date.now().toString(), company: "", role: "",
      startDate: "", endDate: "", current: false, location: "",
      responsibilities: [], achievements: []
    };
    update({ experience: [...state.experience, newExp] });
  };

  return (
    <StepWrapper
      badge="Step 9"
      title="Work Experience"
      description="Build a compelling timeline of your professional journey. Use quantified achievements."
    >
      <div className="max-w-2xl space-y-6">
        <AnimatePresence>
          {state.experience.map((exp) => (
            <ExperienceCard
              key={exp.id} exp={exp}
              onUpdate={(updated) => update({ experience: state.experience.map(e => e.id === exp.id ? updated : e) })}
              onDelete={() => update({ experience: state.experience.filter(e => e.id !== exp.id) })}
            />
          ))}
        </AnimatePresence>
        <Button onClick={addExp} variant="outline" className="w-full rounded-xl border-dashed border-border h-14 text-sm text-muted-foreground hover:text-foreground hover:border-accent/50 gap-2">
          <Plus className="w-4 h-4" /> Add Work Experience
        </Button>
      </div>
    </StepWrapper>
  );
}
