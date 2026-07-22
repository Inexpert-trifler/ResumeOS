"use client";

import { motion } from "framer-motion";
import { COLUMNS, MOCK_APPLICATIONS, JobApplication } from "@/data/mock-tracker";
import { MoreHorizontal, Calendar, MapPin, DollarSign, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

function KanbanCard({ job }: { job: JobApplication }) {
  const getPriorityColor = (p: string) => {
    if (p === "High") return "bg-red-500/10 text-red-500 border-red-500/20";
    if (p === "Medium") return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    return "bg-green-500/10 text-green-500 border-green-500/20";
  };

  return (
    <div 
      className="p-4 rounded-xl border border-border/50 bg-card hover:border-accent/50 hover:shadow-[0_0_15px_rgba(var(--accent),0.1)] transition-all cursor-grab active:cursor-grabbing group"
      draggable
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold shrink-0", job.logoColor)}>
            {job.company.charAt(0)}
          </div>
          <div>
            <h4 className="font-semibold text-sm line-clamp-1">{job.role}</h4>
            <p className="text-xs text-muted-foreground">{job.company}</p>
          </div>
        </div>
        <button className="text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-2 mb-4">
        {job.salary !== "Pending" && job.salary !== "Competitive" && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <DollarSign className="w-3.5 h-3.5" />
            <span>{job.salary}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <MapPin className="w-3.5 h-3.5" />
          <span>{job.location}</span>
        </div>
        {job.appliedDate !== "-" && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="w-3.5 h-3.5" />
            <span>Applied: {job.appliedDate}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-border/50">
        <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border", getPriorityColor(job.priority))}>
          {job.priority}
        </span>
        {job.nextStep && (
          <span className="text-[10px] font-medium text-accent truncate max-w-[120px]" title={job.nextStep}>
            {job.nextStep}
          </span>
        )}
      </div>
    </div>
  );
}

export function TrackerKanban() {
  return (
    <div className="mb-12 overflow-x-auto pb-4 no-scrollbar">
      <div className="flex gap-4 min-w-max">
        {COLUMNS.map((column) => {
          const jobsInColumn = MOCK_APPLICATIONS.filter((job) => job.status === column.id);

          return (
            <div key={column.id} className="w-80 flex flex-col shrink-0">
              {/* Column Header */}
              <div className="flex items-center justify-between mb-4 px-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm">{column.title}</h3>
                  <span className="px-2 py-0.5 rounded-full bg-muted text-xs font-medium text-muted-foreground">
                    {jobsInColumn.length}
                  </span>
                </div>
                <button className="text-muted-foreground hover:text-foreground">
                  <GripVertical className="w-4 h-4 opacity-50" />
                </button>
              </div>

              {/* Column Body */}
              <div className="flex-1 bg-muted/30 rounded-2xl p-2 flex flex-col gap-3 min-h-[200px] border border-border/50 border-dashed">
                {jobsInColumn.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground/50">
                    Drop here
                  </div>
                ) : (
                  jobsInColumn.map((job, i) => (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <KanbanCard job={job} />
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
