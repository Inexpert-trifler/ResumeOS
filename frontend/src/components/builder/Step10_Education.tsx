"use client";

import { useState } from "react";
import { StepWrapper } from "./StepWrapper";
import { BuilderState, Education } from '@/types';
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Step10Props {
  state: BuilderState;
  update: (partial: Partial<BuilderState>) => void;
}

const inputCls = "w-full bg-muted/50 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all";
const labelCls = "block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider";

export function Step10_Education({ state, update }: Step10Props) {
  const addEdu = () => {
    const newEdu: Education = {
      id: Date.now().toString(), institution: "", degree: "", field: "",
      startDate: "", endDate: "", current: false, gpa: "", achievements: []
    };
    update({ education: [...state.education, newEdu] });
  };

  const updateEdu = (id: string, e: Education) =>
    update({ education: state.education.map(x => x.id === id ? e : x) });

  const deleteEdu = (id: string) =>
    update({ education: state.education.filter(e => e.id !== id) });

  return (
    <StepWrapper
      badge="Step 10"
      title="Education"
      description="Add your academic background, degrees, and notable academic achievements."
    >
      <div className="max-w-2xl space-y-6">
        <AnimatePresence>
          {state.education.map((edu) => {
            const setField = (key: keyof Education) => (v: string | boolean) =>
              updateEdu(edu.id, { ...edu, [key]: v });

            return (
              <motion.div key={edu.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                className="relative pl-6 border-l-2 border-accent/30"
              >
                <div className="absolute -left-2 top-4 w-4 h-4 rounded-full border-2 border-accent bg-background" />
                <div className="bg-card border border-border/50 rounded-2xl p-5 shadow-sm ml-2 space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-accent" />
                      <p className="font-bold">{edu.degree || edu.institution || "Education Entry"}</p>
                    </div>
                    <button onClick={() => deleteEdu(edu.id)} className="p-1.5 text-muted-foreground hover:text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <label className={labelCls}>Institution *</label>
                    <input value={edu.institution} onChange={(e) => setField("institution")(e.target.value)} placeholder="MIT, Stanford, IIT..." className={inputCls} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Degree</label>
                      <input value={edu.degree} onChange={(e) => setField("degree")(e.target.value)} placeholder="B.Tech, B.Sc, MBA" className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Field of Study</label>
                      <input value={edu.field} onChange={(e) => setField("field")(e.target.value)} placeholder="Computer Science" className={inputCls} />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className={labelCls}>Start Year</label>
                      <input type="month" value={edu.startDate} onChange={(e) => setField("startDate")(e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>End Year</label>
                      <input type="month" value={edu.endDate} onChange={(e) => setField("endDate")(e.target.value)} disabled={edu.current} className={cn(inputCls, edu.current && "opacity-40")} />
                    </div>
                    <div className="flex items-end pb-2">
                      <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input type="checkbox" checked={edu.current} onChange={(e) => setField("current")(e.target.checked)} className="accent-accent w-4 h-4" />
                        <span className="text-muted-foreground">Ongoing</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>GPA / Score (Optional)</label>
                    <input value={edu.gpa} onChange={(e) => setField("gpa")(e.target.value)} placeholder="3.8 / 4.0 or 9.2 CGPA" className={cn(inputCls, "max-w-xs")} />
                    <p className="text-xs text-muted-foreground mt-1">Only include if 3.5+ GPA (US) or above average.</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        <Button onClick={addEdu} variant="outline" className="w-full rounded-xl border-dashed border-border h-14 text-sm text-muted-foreground hover:text-foreground hover:border-accent/50 gap-2">
          <Plus className="w-4 h-4" /> Add Education
        </Button>
      </div>
    </StepWrapper>
  );
}
