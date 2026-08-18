"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface DashboardHealthChartProps {
  score: number;
}

export function DashboardHealthChart({ score }: DashboardHealthChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const healthData = [
    { name: "ATS Match", value: score, fill: "hsl(var(--accent))" },
    { name: "Remaining", value: 100 - score, fill: "hsl(var(--muted))" },
  ];

  if (!mounted) {
    return (
      <div className="flex-1 min-h-[200px] flex flex-col items-center justify-center">
        <span className="text-3xl font-bold">{score}</span>
        <span className="text-xs text-muted-foreground uppercase tracking-widest">ATS Match</span>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-[200px] relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={healthData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            stroke="none"
          >
            {healthData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
            itemStyle={{ fontSize: "14px", fontWeight: 600 }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-3xl font-bold">{score}</span>
        <span className="text-xs text-muted-foreground uppercase tracking-widest">ATS Match</span>
      </div>
    </div>
  );
}
