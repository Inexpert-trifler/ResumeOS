"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SECTION_ANALYSIS } from "@/data/mock-analyzer";
import { ChevronDown, Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export function AnalyzerSectionAnalysis() {
  const [openSection, setOpenSection] = useState<string | null>(SECTION_ANALYSIS[0].id);

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6">Section by Section</h2>
      <div className="space-y-4">
        {SECTION_ANALYSIS.map((section) => {
          const isOpen = openSection === section.id;

          return (
            <div key={section.id} className="rounded-2xl border border-border/50 bg-card overflow-hidden transition-colors hover:border-accent/30">
              <button
                onClick={() => setOpenSection(isOpen ? null : section.id)}
                className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors",
                    section.score >= 90 ? "bg-green-500/10 text-green-500" : section.score >= 75 ? "bg-yellow-500/10 text-yellow-500" : "bg-red-500/10 text-red-500"
                  )}>
                    {section.score}
                  </div>
                  <h3 className="font-semibold text-lg">{section.name}</h3>
                </div>
                <ChevronDown className={cn("w-5 h-5 text-muted-foreground transition-transform duration-300", isOpen && "rotate-180")} />
              </button>
              
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-5 pt-0 border-t border-border/30 grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                      {/* Strengths & Weaknesses */}
                      <div className="space-y-4">
                        {section.strengths.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold text-green-500 flex items-center gap-2 mb-2">
                              <Plus className="w-4 h-4" /> Strengths
                            </h4>
                            <ul className="space-y-1">
                              {section.strengths.map((str, i) => (
                                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" /> {str}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {section.weaknesses.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold text-red-500 flex items-center gap-2 mb-2">
                              <Minus className="w-4 h-4" /> Weaknesses
                            </h4>
                            <ul className="space-y-1">
                              {section.weaknesses.map((wk, i) => (
                                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" /> {wk}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Suggestions */}
                      {section.suggestions.length > 0 && (
                        <div className="bg-accent/5 p-4 rounded-xl border border-accent/10">
                          <h4 className="text-sm font-semibold text-accent mb-2">Suggestions</h4>
                          <ul className="space-y-2">
                            {section.suggestions.map((sug, i) => (
                              <li key={i} className="text-sm text-muted-foreground leading-relaxed">
                                {sug}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
