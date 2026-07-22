"use client";

import { motion } from "framer-motion";
import { ACTIVITY_FEED } from "@/data/mock-tracker";
import { Award, FileText, Send, XCircle, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const TYPE_CONFIG = {
  offer: { icon: Award, color: "text-green-500", bg: "bg-green-500/10" },
  interview: { icon: Users, color: "text-purple-500", bg: "bg-purple-500/10" },
  applied: { icon: Send, color: "text-blue-500", bg: "bg-blue-500/10" },
  rejected: { icon: XCircle, color: "text-red-500", bg: "bg-red-500/10" },
  resume: { icon: FileText, color: "text-accent", bg: "bg-accent/10" },
};

export function TrackerActivity() {
  return (
    <div className="mb-12">
      <h2 className="text-xl font-bold mb-6">Recent Activity</h2>
      
      <div className="space-y-4">
        {ACTIVITY_FEED.map((activity, i) => {
          const config = TYPE_CONFIG[activity.type as keyof typeof TYPE_CONFIG];
          const Icon = config.icon;

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-4 p-4 rounded-2xl border border-border/50 bg-card/50 hover:bg-card transition-colors"
            >
              <div className={cn("p-2 rounded-xl shrink-0 mt-0.5", config.bg, config.color)}>
                <Icon className="w-4 h-4" />
              </div>
              
              <div className="flex-1">
                <p className="text-sm text-foreground mb-1">
                  <strong className="font-semibold">{activity.company}</strong>: {activity.message}
                </p>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
