"use client";

import { Plus, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export function TrackerHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Application Dashboard</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Track and manage your job hunt like a pro.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Import Jobs
        </Button>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Application
        </Button>
      </div>
    </div>
  );
}
