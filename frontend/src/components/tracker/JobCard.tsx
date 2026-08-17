"use client";

import { motion } from "framer-motion";
import { Briefcase, MapPin, Building, Calendar, Edit3, Trash2, Activity, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { JobDescription } from "@/types";
import { cn } from "@/lib/utils";

interface JobCardProps {
  job: JobDescription;
  onClick: (job: JobDescription) => void;
  onEdit: (job: JobDescription, e: React.MouseEvent) => void;
  onDelete: (job: JobDescription, e: React.MouseEvent) => void;
  index?: number;
}

const STATUS_COLORS: Record<string, { bg: string, text: string, label: string }> = {
  saved: { bg: "bg-slate-500/10", text: "text-slate-500", label: "Saved" },
  applied: { bg: "bg-blue-500/10", text: "text-blue-500", label: "Applied" },
  interviewing: { bg: "bg-purple-500/10", text: "text-purple-500", label: "Interviewing" },
  offer: { bg: "bg-green-500/10", text: "text-green-500", label: "Offer" },
  rejected: { bg: "bg-red-500/10", text: "text-red-500", label: "Rejected" },
};

export function JobCard({ job, onClick, onEdit, onDelete, index = 0 }: JobCardProps) {
  const statusConfig = STATUS_COLORS[job.status] || STATUS_COLORS.saved;
  const matchScore = job.analysis?.jobComplexity ? 100 - (job.analysis.jobComplexity * 0.4) : null; // Mock match score logic until Phase 3

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={() => onClick(job)}
      className="group rounded-2xl border border-border/50 bg-card overflow-hidden hover:border-accent/30 transition-all duration-200 hover:shadow-md cursor-pointer flex flex-col h-full"
    >
      {/* Top Section */}
      <div className="p-4 border-b border-border/50 relative overflow-hidden">
        {/* subtle gradient bg */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        
        <div className="flex justify-between items-start mb-3">
          <div className="flex gap-3 items-start">
            <div className="w-10 h-10 rounded-xl bg-muted/50 border border-border/50 flex items-center justify-center shrink-0 shadow-sm mt-0.5">
              <Building className="w-5 h-5 text-muted-foreground/70" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground leading-tight line-clamp-1 pr-2">{job.jobTitle}</h3>
              <p className="text-sm text-muted-foreground mt-0.5">{job.company}</p>
            </div>
          </div>
          <div className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0", statusConfig.bg, statusConfig.text)}>
            {statusConfig.label}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mt-4">
          {job.location && (
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              <span className="truncate max-w-[100px]">{job.location}</span>
            </div>
          )}
          {job.employmentType && (
            <div className="flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5" />
              <span className="capitalize">{job.employmentType.replace('-', ' ')}</span>
            </div>
          )}
        </div>
      </div>

      {/* Middle/Bottom Section */}
      <div className="p-4 bg-muted/20 flex-1 flex flex-col justify-between group-hover:bg-muted/30 transition-colors">
        
        {/* Insights summary */}
        <div className="space-y-3 mb-4">
           {job.isParsed && job.parsedData ? (
             <div className="space-y-2">
                <div className="flex gap-1.5 flex-wrap">
                  {job.parsedData.technicalSkills.slice(0, 3).map((skill, i) => (
                    <span key={i} className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-background border border-border/50 text-muted-foreground">
                      {skill}
                    </span>
                  ))}
                  {job.parsedData.technicalSkills.length > 3 && (
                     <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-background border border-border/50 text-muted-foreground">
                       +{job.parsedData.technicalSkills.length - 3}
                     </span>
                  )}
                </div>
                
                {matchScore !== null && (
                  <div className="flex items-center justify-between mt-3">
                     <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Activity className="w-3.5 h-3.5" /> Match Potential
                     </span>
                     <div className="flex items-center gap-2">
                       <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                         <div 
                           className={cn(
                             "h-full rounded-full",
                             matchScore > 80 ? "bg-green-500" : matchScore > 60 ? "bg-yellow-500" : "bg-red-500"
                           )}
                           style={{ width: `${matchScore}%` }}
                         />
                       </div>
                       <span className="text-xs font-semibold">{Math.round(matchScore)}%</span>
                     </div>
                  </div>
                )}
             </div>
           ) : (
             <div className="flex items-center gap-2 text-xs text-muted-foreground/70 h-10">
               <Zap className="w-3.5 h-3.5" />
               Processing job insights...
             </div>
           )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-border/50">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            <span>{new Date(job.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={(e) => onEdit(job, e)}>
              <Edit3 className="w-3.5 h-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-red-500 hover:bg-red-500/10" onClick={(e) => onDelete(job, e)}>
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
