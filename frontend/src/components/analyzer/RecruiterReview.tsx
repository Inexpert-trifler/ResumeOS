"use client";

import { motion } from "framer-motion";
import { RECRUITER_TIMELINE } from "@/data/mock-analyzer";
import { Eye, Clock, AlertTriangle } from "lucide-react";

export function AnalyzerRecruiterReview() {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6">Recruiter Eye Tracking</h2>
      <div className="p-8 rounded-3xl border border-border/50 bg-card">
        
        <div className="flex items-start gap-4 mb-8">
          <div className="p-3 rounded-xl bg-accent/10">
            <Eye className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Simulated Recruiter Pass</h3>
            <p className="text-sm text-muted-foreground">
              Based on eye-tracking studies, recruiters spend an average of 7.4 seconds initially scanning a resume. Here is how yours performs.
            </p>
          </div>
        </div>

        <div className="relative pl-6 md:pl-0">
          {/* Vertical line for mobile */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-border/50 md:hidden" />
          
          <div className="space-y-8 md:space-y-0 md:grid md:grid-cols-3 md:gap-6">
            {RECRUITER_TIMELINE.map((step, i) => (
              <motion.div
                key={step.time}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                className="relative"
              >
                {/* Horizontal line for desktop */}
                {i < RECRUITER_TIMELINE.length - 1 && (
                  <div className="hidden md:block absolute top-6 left-[60%] right-[-40%] h-px bg-border/50" />
                )}

                <div className="flex flex-col relative z-10 pl-6 md:pl-0">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-12 h-12 rounded-full bg-background border-2 border-accent flex items-center justify-center shrink-0 absolute -left-6 md:static">
                      <Clock className="w-5 h-5 text-accent" />
                    </div>
                    <span className="font-bold text-lg md:mt-0">{step.time}</span>
                  </div>
                  
                  <div className="p-5 rounded-2xl bg-muted/30 border border-border/50">
                    <h4 className="font-semibold text-foreground mb-1">{step.title}</h4>
                    <p className="text-sm text-muted-foreground mb-3">{step.description}</p>
                    
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-background border border-border/50">
                      {step.status === "Needs Metrics" && <AlertTriangle className="w-3.5 h-3.5 text-yellow-500" />}
                      <span className={step.status === "Needs Metrics" ? "text-yellow-600 dark:text-yellow-400" : "text-green-600 dark:text-green-400"}>
                        {step.status}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
      </div>
    </section>
  );
}
