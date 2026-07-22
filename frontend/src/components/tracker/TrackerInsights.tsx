"use client";

import { motion } from "framer-motion";
import { INSIGHTS_DATA } from "@/data/mock-tracker";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export function TrackerInsights() {
  return (
    <div className="mb-12">
      <h2 className="text-xl font-bold mb-6">Application Activity</h2>
      
      <div className="p-6 rounded-3xl border border-border/50 bg-card w-full h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={INSIGHTS_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorInts" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
            <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--foreground))'
              }} 
            />
            <Area type="monotone" dataKey="applications" stroke="hsl(var(--accent))" fillOpacity={1} fill="url(#colorApps)" strokeWidth={2} name="Applications" />
            <Area type="monotone" dataKey="interviews" stroke="#10b981" fillOpacity={1} fill="url(#colorInts)" strokeWidth={2} name="Interviews" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
