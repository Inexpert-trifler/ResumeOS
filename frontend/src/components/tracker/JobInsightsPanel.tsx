"use client";

import { motion } from "framer-motion";
import { X, Target, Zap, Activity, Code, Hash, ChevronRight, FileText, CheckCircle2 } from "lucide-react";
import type { JobDescription } from "@/types";
import { Button } from "@/components/ui/button";

interface JobInsightsPanelProps {
  job: JobDescription | null;
  onClose: () => void;
  onAnalyze: (id: string) => void;
  isAnalyzing: boolean;
}

export function JobInsightsPanel({ job, onClose, onAnalyze, isAnalyzing }: JobInsightsPanelProps) {
  if (!job) return null;

  return (
    <div className="w-96 shrink-0 border-l border-border/50 bg-card h-full flex flex-col overflow-hidden relative">
      <div className="p-4 border-b border-border/50 flex items-center justify-between shrink-0">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <Zap className="w-4 h-4 text-accent" />
          Job Insights
        </h3>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-full">
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
        {!job.isParsed || !job.parsedData || !job.analysis ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center">
              <Zap className="w-8 h-8 text-accent opacity-50" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-1">Intelligence Engine</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Parse this job description to extract keywords, compute difficulty scores, and generate AI insights.
              </p>
              <Button onClick={() => onAnalyze(job.id)} disabled={isAnalyzing}>
                {isAnalyzing ? "Analyzing..." : "Analyze Job"}
              </Button>
            </div>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            
            {/* Header */}
            <div>
              <h2 className="text-xl font-bold leading-tight mb-1">{job.jobTitle}</h2>
              <p className="text-muted-foreground">{job.company}</p>
            </div>

            {/* Metrics Grid */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Complexity Metrics</h4>
              <div className="grid grid-cols-2 gap-3">
                <MetricCard 
                  label="Job Complexity" 
                  score={job.analysis.jobComplexity || 0} 
                  icon={Activity} 
                />
                <MetricCard 
                  label="ATS Difficulty" 
                  score={job.analysis.atsDifficulty || 0} 
                  icon={Target} 
                  color="blue"
                />
                <MetricCard 
                  label="Technical Depth" 
                  score={job.analysis.technicalDepth || 0} 
                  icon={Code} 
                  color="purple"
                />
                <MetricCard 
                  label="Competition" 
                  score={job.analysis.estimatedCompetition === 'low' ? 25 : job.analysis.estimatedCompetition === 'medium' ? 50 : job.analysis.estimatedCompetition === 'high' ? 75 : 100} 
                  valueOverride={job.analysis.estimatedCompetition ? job.analysis.estimatedCompetition.replace('-', ' ') : 'unknown'}
                  icon={Target} 
                  color="rose"
                />
              </div>
            </div>

            {/* AI Insights List */}
            {job.analysis.insights && job.analysis.insights.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Strategic Insights</h4>
                <div className="space-y-3">
                  {job.analysis.insights.map((insight, i) => (
                    <div key={i} className="flex gap-3 bg-muted/30 p-3 rounded-xl border border-border/50">
                      <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                      <p className="text-sm text-foreground/80 leading-snug">{insight}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Keywords */}
            {job.keywords && job.keywords.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                  <Hash className="w-4 h-4" /> Top Keywords
                </h4>
                <div className="flex flex-wrap gap-2">
                  {job.keywords.slice(0, 15).map(kw => (
                    <span 
                      key={kw.id} 
                      className="px-2 py-1 rounded-md text-xs font-medium bg-muted/50 border border-border/50 text-foreground flex items-center gap-1.5"
                    >
                      {kw.keyword}
                      <span className="text-[10px] text-muted-foreground bg-background px-1 rounded-sm">{kw.weight}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Raw Requirements */}
            {job.parsedData.qualifications && job.parsedData.qualifications.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Core Requirements</h4>
                <ul className="space-y-2 list-none">
                  {job.parsedData.qualifications.slice(0, 5).map((q, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-accent/50 mt-1">•</span>
                      <span>{q}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </motion.div>
        )}
      </div>
      
      {/* Footer Actions */}
      <div className="p-4 border-t border-border/50 shrink-0">
        <Button className="w-full" disabled={!job.isParsed}>
          <FileText className="w-4 h-4 mr-2" /> Match with Resume <ChevronRight className="w-4 h-4 ml-auto" />
        </Button>
      </div>
    </div>
  );
}

function MetricCard({ label, score, icon: Icon, color = "accent", valueOverride }: { label: string, score: number, icon: React.ElementType, color?: string, valueOverride?: string }) {
  // Mapping color prop to tailwind classes for the icon background
  const colorMap: Record<string, string> = {
    accent: "bg-accent/10 text-accent",
    blue: "bg-blue-500/10 text-blue-500",
    purple: "bg-purple-500/10 text-purple-500",
    rose: "bg-rose-500/10 text-rose-500",
  };
  
  const scoreColorMap: Record<string, string> = {
    accent: "bg-accent",
    blue: "bg-blue-500",
    purple: "bg-purple-500",
    rose: "bg-rose-500",
  };

  return (
    <div className="p-3 rounded-xl border border-border/50 bg-card shadow-sm flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${colorMap[color]}`}>
          <Icon className="w-3.5 h-3.5" />
        </div>
        <span className="text-xs font-medium text-muted-foreground line-clamp-1">{label}</span>
      </div>
      <div className="mt-auto">
        <div className="flex items-end justify-between mb-1.5">
          <span className="text-lg font-bold leading-none capitalize">
            {valueOverride || score}
          </span>
        </div>
        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
          <div className={`h-full rounded-full ${scoreColorMap[color]}`} style={{ width: `${score}%` }} />
        </div>
      </div>
    </div>
  );
}
