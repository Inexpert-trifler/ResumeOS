"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
  size = "md",
}: EmptyStateProps) {
  const sizes = {
    sm: { icon: "w-8 h-8", iconBox: "w-14 h-14", title: "text-base", desc: "text-xs" },
    md: { icon: "w-10 h-10", iconBox: "w-20 h-20", title: "text-lg", desc: "text-sm" },
    lg: { icon: "w-12 h-12", iconBox: "w-24 h-24", title: "text-xl", desc: "text-base" },
  };
  const s = sizes[size];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={cn(
        "flex flex-col items-center justify-center text-center py-16 px-8",
        className
      )}
    >
      {/* Icon container */}
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 15 }}
        className={cn(
          "flex items-center justify-center rounded-2xl bg-muted/60 border border-border/50 mb-6",
          s.iconBox
        )}
      >
        <Icon className={cn("text-muted-foreground/60", s.icon)} strokeWidth={1.5} />
      </motion.div>

      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className={cn("font-semibold text-foreground mb-2 tracking-tight", s.title)}
      >
        {title}
      </motion.h3>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className={cn("text-muted-foreground max-w-xs leading-relaxed", s.desc)}
      >
        {description}
      </motion.p>

      {action && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mt-6"
        >
          <Button
            size="sm"
            className="rounded-full px-5"
            onClick={action.onClick}
          >
            {action.label}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}
