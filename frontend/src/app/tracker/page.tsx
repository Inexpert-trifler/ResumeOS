"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Plus, Briefcase, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JobService } from "@/services";
import { useJobStore } from "@/stores";
import type { JobDescription, JobCreatePayload, JobUpdatePayload } from "@/types";

import { JobCard } from "@/components/tracker/JobCard";
import { JobDialog } from "@/components/tracker/JobDialog";
import { JobInsightsPanel } from "@/components/tracker/JobInsightsPanel";

export default function JobIntelligenceEngine() {
  const { getToken, isLoaded } = useAuth();
  const { jobs, fetchJobs, createJob, updateJob, deleteJob, analyzeJob, isLoading, getJobById } = useJobStore();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobDescription | null>(null);
  const [activeInsightJob, setActiveInsightJob] = useState<JobDescription | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [search, setSearch] = useState("");

  // Setup service token
  useEffect(() => {
    if (isLoaded) {
      JobService.configureTokenProvider(async () => {
        try {
          return await getToken();
        } catch {
          return null;
        }
      });
      fetchJobs();
    }
  }, [isLoaded, getToken, fetchJobs]);

  const handleCreateNew = () => {
    setSelectedJob(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (job: JobDescription, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedJob(job);
    setIsDialogOpen(true);
  };

  const handleDelete = async (job: JobDescription, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete ${job.company} - ${job.jobTitle}?`)) {
      await deleteJob(job.id);
      if (activeInsightJob?.id === job.id) setActiveInsightJob(null);
    }
  };

  const handleSave = async (payload: JobCreatePayload | JobUpdatePayload) => {
    if (selectedJob) {
      await updateJob(selectedJob.id, payload as JobUpdatePayload);
    } else {
      await createJob(payload as JobCreatePayload);
    }
  };

  const handleCardClick = async (job: JobDescription) => {
    // If not analyzed or missing full data, fetch it
    if (job.isParsed && !job.keywords) {
       const fullJob = await getJobById(job.id);
       setActiveInsightJob(fullJob);
    } else {
       setActiveInsightJob(job);
    }
  };

  const handleAnalyzeJob = async (id: string) => {
    setIsAnalyzing(true);
    try {
      await analyzeJob(id);
      // Fetch full updated job for the panel
      const updated = await getJobById(id, true);
      setActiveInsightJob(updated);
    } catch (err) {
      console.error("Analysis failed", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Sync active job if jobs array changes (e.g., after edit)
  useEffect(() => {
    if (activeInsightJob) {
      const updated = jobs.find(j => j.id === activeInsightJob.id);
      if (updated && updated.updatedAt !== activeInsightJob.updatedAt) {
        // preserve the fetched full data (keywords, analysis) unless we have it in the updated state
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setActiveInsightJob({
           ...updated,
           keywords: updated.keywords || activeInsightJob.keywords,
           analysis: updated.analysis || activeInsightJob.analysis
        });
      }
    }
  }, [jobs, activeInsightJob]);


  const filteredJobs = jobs.filter(j => 
    j.company.toLowerCase().includes(search.toLowerCase()) || 
    j.jobTitle.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-80px)] overflow-hidden">
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <div className="p-8 max-w-7xl mx-auto w-full flex-1">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2 flex items-center gap-3">
                <Briefcase className="w-8 h-8 text-accent" />
                Job Intelligence Engine
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl">
                Paste job descriptions to extract keywords, analyze requirements, and optimize your resume for ATS tracking.
              </p>
            </div>
            <Button onClick={handleCreateNew} size="lg" className="rounded-full shadow-lg shadow-accent/20">
              <Plus className="w-5 h-5 mr-2" />
              Add Job
            </Button>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4 mb-8">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search jobs or companies..."
                className="w-full pl-9 pr-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all shadow-sm"
              />
            </div>
            <Button variant="outline" size="icon" className="shrink-0 rounded-lg">
              <Filter className="w-4 h-4" />
            </Button>
          </div>

          {/* Grid */}
          {isLoading && jobs.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-64 rounded-2xl bg-card border border-border/50 animate-pulse" />
              ))}
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-border rounded-2xl bg-card/50">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">No jobs tracked yet</h3>
              <p className="text-muted-foreground mt-2 mb-6 max-w-md mx-auto">
                Add your first job description to start analyzing requirements and tailoring your resume.
              </p>
              <Button onClick={handleCreateNew}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Job
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJobs.map((job, idx) => (
                <JobCard 
                  key={job.id} 
                  job={job} 
                  onClick={handleCardClick}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  index={idx} 
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Slide-over Insights Panel */}
      {activeInsightJob && (
        <JobInsightsPanel 
          job={activeInsightJob}
          onClose={() => setActiveInsightJob(null)}
          onAnalyze={handleAnalyzeJob}
          isAnalyzing={isAnalyzing}
        />
      )}

      {/* Dialog for Create/Edit */}
      <JobDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        job={selectedJob}
        onSave={handleSave}
      />
    </div>
  );
}
