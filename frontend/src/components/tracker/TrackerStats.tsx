"use client";

import { motion } from "framer-motion";
import { TRACKER_STATS } from "@/data/mock-tracker";
import { Send, Users, XCircle, Award, Bookmark, Star } from "lucide-react";

export function TrackerStats() {
  const stats = [
    { label: "Applied", value: TRACKER_STATS.applied, icon: Send, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Interviewing", value: TRACKER_STATS.interviewing, icon: Users, color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "Offers", value: TRACKER_STATS.offers, icon: Award, color: "text-green-500", bg: "bg-green-500/10" },
    { label: "Rejected", value: TRACKER_STATS.rejected, icon: XCircle, color: "text-red-500", bg: "bg-red-500/10" },
    { label: "Wishlist", value: TRACKER_STATS.wishlist, icon: Star, color: "text-yellow-500", bg: "bg-yellow-500/10" },
    { label: "Saved Jobs", value: TRACKER_STATS.saved, icon: Bookmark, color: "text-orange-500", bg: "bg-orange-500/10" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="p-4 rounded-2xl border border-border/50 bg-card hover:border-accent/30 transition-colors flex flex-col items-start"
        >
          <div className={`p-2 rounded-lg mb-3 ${stat.bg} ${stat.color}`}>
            <stat.icon className="w-4 h-4" />
          </div>
          <span className="text-2xl font-bold tracking-tight mb-1">{stat.value}</span>
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</span>
        </motion.div>
      ))}
    </div>
  );
}
