"use client";

import { motion } from "framer-motion";
import { QUICK_ACTIONS } from "@/data/mock-dashboard";
import Link from "next/link";
import { Plus, Layout, Target, MessageSquare } from "lucide-react";

const ICON_MAP: Record<string, React.ElementType> = {
  Plus,
  Layout,
  Target,
  MessageSquare,
};

export function DashboardQuickActions() {
  return (
    <section>
      <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {QUICK_ACTIONS.map((action, index) => {
          const Icon = ICON_MAP[action.icon] || Plus;

          return (
            <Link href={action.href} key={action.id}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group p-5 rounded-2xl border border-border/50 bg-card hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 transition-all cursor-pointer relative overflow-hidden h-full flex flex-col"
              >
                <div className={`w-10 h-10 rounded-xl mb-4 flex items-center justify-center ${action.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-foreground mb-1 group-hover:text-accent transition-colors">
                  {action.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-auto">
                  {action.description}
                </p>
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-10 transition-opacity">
                  <Icon className="w-16 h-16 transform translate-x-4 -translate-y-4" />
                </div>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
