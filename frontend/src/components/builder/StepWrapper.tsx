"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface StepWrapperProps {
  title: string;
  description?: string;
  children: ReactNode;
  badge?: string;
  actions?: ReactNode;
}

const variants = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -30 },
};

export function StepWrapper({ title, description, children, badge, actions }: StepWrapperProps) {
  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {badge && (
        <div className="inline-block px-3 py-1 mb-4 rounded-full bg-accent/10 text-accent text-xs font-bold uppercase tracking-wider">
          {badge}
        </div>
      )}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">{title}</h2>
          {description && (
            <p className="text-muted-foreground text-lg max-w-xl">{description}</p>
          )}
        </div>
        {actions && (
          <div className="shrink-0">
            {actions}
          </div>
        )}
      </div>
      <div className="mb-10" />
      <div>{children}</div>
    </motion.div>
  );
}
