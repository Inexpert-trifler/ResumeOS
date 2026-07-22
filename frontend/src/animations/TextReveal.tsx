"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function TextReveal({
  text,
  className,
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const words = text.split(" ");
  
  return (
    <div className={cn("flex flex-wrap overflow-hidden", className)}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ y: "100%" }}
          whileInView={{ y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.5,
            delay: delay + i * 0.05,
            ease: [0.21, 0.47, 0.32, 0.98],
          }}
          className="mr-1 inline-block pb-1"
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
}
