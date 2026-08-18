"use client";

import { StepWrapper } from "./StepWrapper";
import { BuilderAiAssistant } from "./BuilderAiAssistant";
import { BuilderState, Achievement, Certificate } from '@/types';
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trophy, Trash2, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const inputCls = "w-full bg-muted/50 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all";
const labelCls = "block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider";

interface Step11Props { state: BuilderState; update: (p: Partial<BuilderState>) => void; }

export function Step11_Achievements({ state, update }: Step11Props) {
  const add = () => {
    const item: Achievement = { id: Date.now().toString(), title: "", description: "", date: "" };
    update({ achievements: [...state.achievements, item] });
  };

  return (
    <StepWrapper badge="Step 11" title="Achievements" description="Awards, honors, recognitions, competitions — add things you've won or been recognized for.">
      <div className="max-w-2xl space-y-4">
        <AnimatePresence>
          {state.achievements.map((a) => {
            const set = (key: keyof Achievement) => (v: string) =>
              update({ achievements: state.achievements.map(x => x.id === a.id ? { ...x, [key]: v } : x) });
            return (
              <motion.div key={a.id} layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                className="bg-card border border-border/50 rounded-2xl p-5 shadow-sm"
              >
                <div className="flex justify-between items-center mb-4 gap-3">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    <span className="font-bold text-sm">{a.title || "Achievement"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BuilderAiAssistant
                      sectionType="achievements"
                      targetField="achievement_description"
                      fieldLabel={a.title || "Achievement"}
                      currentText={[a.title, a.description].filter(Boolean).join("\n")}
                      onApply={(nextText) => update({ achievements: state.achievements.map(x => x.id === a.id ? { ...x, description: nextText } : x) })}
                      targetRole={state.targetRole}
                      builderContext={{
                        careerGoal: state.careerGoal,
                        achievementTitle: a.title,
                        achievementDate: a.date,
                      }}
                      userInstruction="Sharpen this achievement into a concise, credible accomplishment statement."
                      allowInsert={false}
                    />
                    <button onClick={() => update({ achievements: state.achievements.filter(x => x.id !== a.id) })} className="text-muted-foreground hover:text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className={labelCls}>Achievement Title</label>
                    <input value={a.title} onChange={(e) => set("title")(e.target.value)} placeholder="1st Place, Hackathon 2024" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Description</label>
                    <textarea value={a.description} onChange={(e) => set("description")(e.target.value)} rows={2} placeholder="Brief description of what you won or achieved..." className={cn(inputCls, "resize-none")} />
                  </div>
                  <div>
                    <label className={labelCls}>Date</label>
                    <input type="month" value={a.date} onChange={(e) => set("date")(e.target.value)} className={cn(inputCls, "max-w-xs")} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        <Button onClick={add} variant="outline" className="w-full rounded-xl border-dashed border-border h-14 text-sm text-muted-foreground hover:border-accent/50 gap-2">
          <Plus className="w-4 h-4" /> Add Achievement
        </Button>
      </div>
    </StepWrapper>
  );
}

interface Step12Props { state: BuilderState; update: (p: Partial<BuilderState>) => void; }

export function Step12_Certificates({ state, update }: Step12Props) {
  const add = () => {
    const item: Certificate = { id: Date.now().toString(), name: "", issuer: "", date: "", credentialId: "", url: "" };
    update({ certificates: [...state.certificates, item] });
  };

  return (
    <StepWrapper badge="Step 12" title="Certifications" description="Add technical certs, professional licenses, and course completions.">
      <div className="max-w-2xl space-y-4">
        <AnimatePresence>
          {state.certificates.map((c) => {
            const set = (key: keyof Certificate) => (v: string) =>
              update({ certificates: state.certificates.map(x => x.id === c.id ? { ...x, [key]: v } : x) });
            return (
              <motion.div key={c.id} layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                className="bg-card border border-border/50 rounded-2xl p-5 shadow-sm"
              >
                <div className="flex justify-between items-center mb-4 gap-3">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-accent" />
                    <span className="font-bold text-sm">{c.name || "Certificate"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BuilderAiAssistant
                      sectionType="certificates"
                      targetField="certificate_entry"
                      fieldLabel={c.name || "Certificate"}
                      currentText={[c.name, c.issuer, c.credentialId].filter(Boolean).join(" · ")}
                      onApply={(nextText) => update({ certificates: state.certificates.map(x => x.id === c.id ? { ...x, name: nextText } : x) })}
                      builderContext={{
                        certificateName: c.name,
                        issuer: c.issuer,
                        credentialId: c.credentialId,
                      }}
                      userInstruction="Clean up this certificate entry so it reads clearly and professionally."
                      allowInsert={false}
                    />
                    <button onClick={() => update({ certificates: state.certificates.filter(x => x.id !== c.id) })} className="text-muted-foreground hover:text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Certificate Name</label>
                    <input value={c.name} onChange={(e) => set("name")(e.target.value)} placeholder="AWS Certified Developer" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Issued By</label>
                    <input value={c.issuer} onChange={(e) => set("issuer")(e.target.value)} placeholder="Amazon Web Services" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Issue Date</label>
                    <input type="month" value={c.date} onChange={(e) => set("date")(e.target.value)} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Credential ID</label>
                    <input value={c.credentialId} onChange={(e) => set("credentialId")(e.target.value)} placeholder="ABC-1234" className={inputCls} />
                  </div>
                  <div className="col-span-2">
                    <label className={labelCls}>Verification URL</label>
                    <input value={c.url} onChange={(e) => set("url")(e.target.value)} placeholder="credly.com/..." className={inputCls} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        <Button onClick={add} variant="outline" className="w-full rounded-xl border-dashed border-border h-14 text-sm text-muted-foreground hover:border-accent/50 gap-2">
          <Plus className="w-4 h-4" /> Add Certificate
        </Button>
      </div>
    </StepWrapper>
  );
}
