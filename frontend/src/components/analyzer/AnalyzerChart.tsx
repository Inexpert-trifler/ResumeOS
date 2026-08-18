"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface AnalyzerChartProps {
  score: number;
}

export function AnalyzerChart({ score }: AnalyzerChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const overallData = [
    { name: "Score", value: score, fill: "hsl(var(--accent))" },
    { name: "Remaining", value: 100 - score, fill: "hsl(var(--muted))" },
  ];

  if (!mounted) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <span className="text-4xl font-bold tracking-tight">{score}</span>
        <span className="text-xs text-muted-foreground uppercase font-semibold">Match Score</span>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={overallData}
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={85}
            paddingAngle={5}
            dataKey="value"
            stroke="none"
          >
            {overallData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-4xl font-bold tracking-tight">{score}</span>
        <span className="text-xs text-muted-foreground uppercase font-semibold">Match Score</span>
      </div>
    </div>
  );
}
