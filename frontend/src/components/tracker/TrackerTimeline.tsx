"use client";

import { motion } from "framer-motion";
import { TIMELINE_EVENTS } from "@/data/mock-tracker";
import { Clock, Video, Building2 } from "lucide-react";

export function TrackerTimeline() {
  return (
    <div className="mb-12">
      <h2 className="text-xl font-bold mb-6">Upcoming Schedule</h2>
      
      <div className="relative pl-6">
        {/* Vertical Line */}
        <div className="absolute left-[11px] top-2 bottom-2 w-px bg-border/50" />
        
        <div className="space-y-8">
          {TIMELINE_EVENTS.map((event, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="relative flex items-start gap-4 group"
            >
              {/* Dot */}
              <div className="absolute -left-6 top-1.5 w-6 h-6 rounded-full bg-background border-2 border-accent flex items-center justify-center z-10 group-hover:bg-accent transition-colors">
                <div className="w-2 h-2 rounded-full bg-accent group-hover:bg-white transition-colors" />
              </div>

              {/* Content */}
              <div className="flex-1 p-4 rounded-xl border border-border/50 bg-card hover:border-accent/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1 text-sm font-semibold text-accent">
                    <Clock className="w-4 h-4" />
                    <span>{event.date} • {event.time}</span>
                  </div>
                  <h4 className="font-bold text-lg mb-1">{event.type}</h4>
                  <p className="text-muted-foreground text-sm flex items-center gap-2">
                    <Building2 className="w-4 h-4" /> {event.company}
                  </p>
                </div>

                <div className="px-3 py-1.5 rounded-lg bg-muted text-xs font-medium text-muted-foreground flex items-center gap-2 shrink-0">
                  <Video className="w-3.5 h-3.5" />
                  {event.location}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
