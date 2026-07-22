"use client";

import { useStudio } from "./StudioContext";
import { useCallback } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Undo2, Redo2, Save, Download, Printer, Palette, Type,
  ZoomIn, ZoomOut, Eye, ChevronDown, FileText, Layers
} from "lucide-react";
import Link from "next/link";
import { saveResumeDraft, readResumeDraft } from "@/lib/resume-draft";
import { DEFAULT_SECTIONS, DEFAULT_SETTINGS } from "@/data/mock-resume";

const TEMPLATES = [
  { id: "classic",   label: "Classic"   },
  { id: "modern",    label: "Modern"    },
  { id: "minimal",   label: "Minimal"   },
  { id: "corporate", label: "Corporate" },
];

const FONTS = ["Inter", "Georgia", "Merriweather", "Roboto", "Lato", "Source Sans Pro"];
const ZOOMS = [75, 100, 125, 150, 200];

export function StudioToolbar() {
  const { state, dispatch, canUndo, canRedo } = useStudio();
  const { settings, resume } = state;

  // ── Save to localStorage ──────────────────────────────────────────────────
  const handleSave = useCallback(() => {
    const existing = readResumeDraft();
    saveResumeDraft({
      builder: existing?.builder ?? ({} as any),
      resume: state.resume,
      sections: state.sections,
      settings: state.settings,
      updatedAt: new Date().toISOString(),
    });
  }, [state]);

  // ── PDF Export ────────────────────────────────────────────────────────────
  const handleExportPDF = useCallback(async () => {
    const fileName = resume.header.name
      ? `${resume.header.name.replace(/\s+/g, "_")}_Resume`
      : "Resume";

    // 1. Try the backend — it returns a fully styled, print-ready HTML document
    try {
      const res = await fetch("http://localhost:4000/api/export-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume: state.resume, settings: state.settings }),
      });
      if (res.ok) {
        const html = await res.text();
        const printWindow = window.open("", "_blank", "width=900,height=1200");
        if (printWindow) {
          printWindow.document.write(html);
          printWindow.document.close();
          printWindow.focus();
          setTimeout(() => {
            printWindow.print();
          }, 500);
          return;
        }
      }
    } catch {
      // Backend unavailable — fall through to client-side fallback
    }

    // 2. Client-side fallback: clone the canvas element into a print window
    const canvasEl = document.getElementById("resume-canvas-paper");
    if (!canvasEl) { window.print(); return; }

    const printWindow = window.open("", "_blank", "width=900,height=1200");
    if (!printWindow) { window.print(); return; }

    // Collect all stylesheets from the current page
    const styles = Array.from(document.styleSheets)
      .map((sheet) => {
        try {
          return Array.from(sheet.cssRules)
            .map((r) => r.cssText)
            .join("\n");
        } catch {
          return "";
        }
      })
      .join("\n");

    printWindow.document.write(`<!DOCTYPE html>
<html>
  <head>
    <title>${fileName}</title>
    <style>
      @page { size: A4; margin: 0; }
      * { box-sizing: border-box; }
      body { margin: 0; background: white; }
      @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
      ${styles}
    </style>
  </head>
  <body>${canvasEl.outerHTML}</body>
</html>`);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  }, [state, resume]);

  return (
    <header className="h-14 border-b border-border/50 bg-background/95 backdrop-blur-md flex items-center justify-between px-4 shrink-0 z-50">
      {/* Left — Brand + Nav */}
      <div className="flex items-center gap-4">
        <Link href="/" className="font-bold text-base tracking-tight shrink-0">
          Resume<span className="text-accent">OS</span>
        </Link>
        <div className="w-px h-5 bg-border/50" />

        {/* Undo / Redo */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => dispatch({ type: "UNDO" })}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
            className={cn("p-1.5 rounded-lg transition-colors", canUndo ? "hover:bg-muted text-foreground" : "text-muted-foreground/30 cursor-not-allowed")}
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => dispatch({ type: "REDO" })}
            disabled={!canRedo}
            title="Redo (Ctrl+Y)"
            className={cn("p-1.5 rounded-lg transition-colors", canRedo ? "hover:bg-muted text-foreground" : "text-muted-foreground/30 cursor-not-allowed")}
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>

        <div className="w-px h-5 bg-border/50" />

        {/* Template Selector */}
        <div className="relative group">
          <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-muted text-sm font-medium transition-colors">
            <Layers className="w-3.5 h-3.5 text-accent" />
            {TEMPLATES.find(t => t.id === settings.template)?.label}
            <ChevronDown className="w-3 h-3 text-muted-foreground" />
          </button>
          <div className="absolute top-full left-0 mt-1 bg-card border border-border rounded-xl shadow-xl hidden group-hover:block z-50 min-w-[140px] overflow-hidden">
            {TEMPLATES.map(t => (
              <button
                key={t.id}
                onClick={() => dispatch({ type: "UPDATE_SETTINGS", payload: { template: t.id as any } })}
                className={cn(
                  "w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-muted",
                  settings.template === t.id && "text-accent font-semibold bg-accent/5"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Font Selector */}
        <div className="relative group">
          <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-muted text-sm font-medium transition-colors">
            <Type className="w-3.5 h-3.5 text-muted-foreground" />
            {settings.fontFamily}
            <ChevronDown className="w-3 h-3 text-muted-foreground" />
          </button>
          <div className="absolute top-full left-0 mt-1 bg-card border border-border rounded-xl shadow-xl hidden group-hover:block z-50 min-w-[180px] overflow-hidden">
            {FONTS.map(f => (
              <button
                key={f}
                onClick={() => dispatch({ type: "UPDATE_SETTINGS", payload: { fontFamily: f } })}
                style={{ fontFamily: f }}
                className={cn(
                  "w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-muted",
                  settings.fontFamily === f && "text-accent font-semibold bg-accent/5"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Center — Zoom Controls */}
      <div className="flex items-center gap-1 bg-muted/50 rounded-xl px-2 py-1">
        <button
          onClick={() => dispatch({ type: "UPDATE_SETTINGS", payload: { zoom: Math.max(50, settings.zoom - 25) } })}
          className="p-1 rounded-lg hover:bg-muted transition-colors"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <div className="relative group">
          <button className="px-2 text-xs font-bold tabular-nums min-w-[44px] text-center">
            {settings.zoom}%
          </button>
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-card border border-border rounded-xl shadow-xl hidden group-hover:block z-50 min-w-[100px] overflow-hidden">
            {ZOOMS.map(z => (
              <button
                key={z}
                onClick={() => dispatch({ type: "UPDATE_SETTINGS", payload: { zoom: z } })}
                className={cn("w-full px-4 py-2 text-sm text-center hover:bg-muted transition-colors", settings.zoom === z && "text-accent font-bold")}
              >
                {z}%
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={() => dispatch({ type: "UPDATE_SETTINGS", payload: { zoom: Math.min(200, settings.zoom + 25) } })}
          className="p-1 rounded-lg hover:bg-muted transition-colors"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Right — Actions */}
      <div className="flex items-center gap-2">
        {/* Accent Color */}
        <div className="flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="color"
            value={settings.accentColor}
            onChange={(e) => dispatch({ type: "UPDATE_SETTINGS", payload: { accentColor: e.target.value } })}
            className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent p-0"
            title="Accent Color"
          />
        </div>

        <div className="w-px h-5 bg-border/50" />

        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-muted text-sm font-medium transition-colors"
          title="Save to browser storage"
        >
          <Save className="w-3.5 h-3.5" /> Save
        </button>
        <button
          onClick={handleExportPDF}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent text-accent-foreground text-sm font-bold hover:bg-accent/90 transition-colors shadow-sm"
          title="Export as PDF"
        >
          <Download className="w-3.5 h-3.5" /> Export PDF
        </button>
      </div>
    </header>
  );
}
