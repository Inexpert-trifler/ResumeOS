"use client";

import { useState } from "react";
import { FadeUp } from "@/animations/FadeUp";
import { GitBranch, Sparkles, Star, Loader2, Search, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GitHubService, type GitHubAnalysisResponse } from "@/services/GitHubService";
import { useAuth } from "@clerk/nextjs";

export function GitHubWorkspace() {
  const { isLoaded } = useAuth();
  const [username, setUsername] = useState("");
  const [data, setData] = useState<GitHubAnalysisResponse["data"] | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!username.trim() || !isLoaded) return;
    setIsAnalyzing(true);
    setError(null);
    try {
      const res = await GitHubService.analyze(username.trim());
      setData(res);
      setIsAnalyzing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to analyze GitHub profile.");
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-y-auto no-scrollbar">

      {/* Top Header */}
      <div className="h-16 flex items-center justify-between px-8 border-b border-border/50 shrink-0 bg-background/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-foreground/5 border border-border flex items-center justify-center">
            <GitBranch className="w-4 h-4 text-foreground" />
          </div>
          <div>
            <h1 className="font-semibold text-sm">GitHub Profile Optimizer</h1>
            <p className="text-[10px] text-muted-foreground">Public Repository & Portfolio Intelligence</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-semibold text-emerald-500">Public API Active</span>
        </div>
      </div>

      <div className="p-8 space-y-8 max-w-4xl w-full mx-auto">

        {/* Search Input Box */}
        <FadeUp>
          <div className="p-6 rounded-3xl border border-border/50 bg-card shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold">
              <Search className="w-4 h-4 text-accent" /> Public GitHub Analysis
            </div>
            <p className="text-xs text-muted-foreground">
              Enter any public GitHub username to analyze repository quality, documentation structure, and recruiter appeal.
            </p>

            {error && (
              <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium">
                {error}
              </div>
            )}

            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-semibold">@</span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="github-username (e.g. gaearon, torvalds)"
                  className="w-full h-11 pl-8 pr-4 rounded-xl bg-background border border-border/60 text-sm focus:outline-none focus:border-accent"
                />
              </div>

              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !username.trim()}
                className="h-11 px-6 rounded-xl bg-accent text-accent-foreground font-semibold gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Analyzing Repos...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" /> Analyze Profile
                  </>
                )}
              </Button>
            </div>
          </div>
        </FadeUp>

        {/* Results Card */}
        {data && (
          <FadeUp delay={0.1}>
            <div className="space-y-6">
              
              {/* Overall Score Header */}
              <div className="p-6 rounded-3xl border border-border/50 bg-card shadow-sm flex items-center justify-between gap-6">
                <div>
                  <h2 className="text-xl font-bold">@{data.username} Portfolio Analysis</h2>
                  <p className="text-xs text-muted-foreground mt-1">
                    Analyzed {data.repos.length} public repositories
                  </p>
                </div>

                <div className="w-20 h-20 rounded-full bg-accent/10 border-2 border-accent/40 flex flex-col items-center justify-center shrink-0">
                  <span className="text-2xl font-black text-accent">{data.analysis.overallScore}</span>
                  <span className="text-[9px] uppercase font-bold text-muted-foreground">Score</span>
                </div>
              </div>

              {/* Sub-scores Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-4 rounded-2xl border border-border/50 bg-card text-center">
                  <span className="text-xl font-bold text-blue-500">{data.analysis.profileScore}</span>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Profile Score</p>
                </div>
                <div className="p-4 rounded-2xl border border-border/50 bg-card text-center">
                  <span className="text-xl font-bold text-emerald-500">{data.analysis.repositoryScore}</span>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Repo Quality</p>
                </div>
                <div className="p-4 rounded-2xl border border-border/50 bg-card text-center">
                  <span className="text-xl font-bold text-amber-500">{data.analysis.readmeScore}</span>
                  <p className="text-[10px] text-muted-foreground mt-0.5">README Depth</p>
                </div>
                <div className="p-4 rounded-2xl border border-border/50 bg-card text-center">
                  <span className="text-xl font-bold text-purple-500">{data.analysis.documentationScore}</span>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Documentation</p>
                </div>
              </div>

              {/* Recommendations */}
              <div className="p-6 rounded-2xl border border-border/50 bg-card space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">Recruiter Optimization Tips</h3>
                <ul className="space-y-2">
                  {data.analysis.recommendations.map((rec, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Repositories List */}
              {data.repos.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">Public Repositories</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {data.repos.map((repo, idx) => (
                      <div key={idx} className="p-4 rounded-xl border border-border/50 bg-card space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-accent">{repo.name}</span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1 font-semibold">
                            <Star className="w-3 h-3 text-amber-500" /> {repo.stars}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">{repo.description || "No description provided."}</p>
                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-muted text-[10px] font-semibold text-foreground">
                          {repo.language}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </FadeUp>
        )}

      </div>
    </div>
  );
}
