"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { useCallback, useEffect, useRef } from "react";
import { readResumeDraft, saveResumeDraft, type ResumeDraft } from "@/lib/resume-draft";
import { ResumeService } from "@/services/ResumeService";
import { useResumeStore } from "@/stores/useResumeStore";

const DRAFT_EVENT = "resumeos:sprint-1-draft:updated";
export const CLOUD_DRAFT_RESTORED_EVENT = "resumeos:cloud-draft-restored";

function updatedAt(draft: ResumeDraft | null): number {
  return draft ? Date.parse(draft.updatedAt) || 0 : 0;
}

function payloadFromDraft(draft: ResumeDraft) {
  const name = draft.resume.header.name.trim();
  const title = name ? `${name}'s resume` : draft.builder.targetRole.trim() || "Untitled resume";
  return { title, resumeJson: draft as unknown as Record<string, unknown>, selectedTemplate: draft.settings.template };
}

function isDraft(value: unknown): value is ResumeDraft {
  return Boolean(value && typeof value === "object" && "resume" in value && "builder" in value && "settings" in value);
}

export function CloudSyncProvider({ children }: { children: React.ReactNode }) {
  const { isLoaded, userId, getToken } = useAuth();
  const { user } = useUser();
  const resumeId = useRef<string | null>(null);
  const bootstrapping = useRef(false);
  const ignoreNextDraftSync = useRef(false);
  const timer = useRef<number | null>(null);

  const setStatus = useCallback((syncStatus: "idle" | "syncing" | "offline" | "error", syncError: string | null = null) => {
    useResumeStore.getState().setCloudSyncState({ syncStatus, syncError });
  }, []);

  const sync = useCallback(async () => {
    if (!userId || bootstrapping.current || !navigator.onLine) {
      if (!navigator.onLine) setStatus("offline");
      return;
    }
    const draft = readResumeDraft();
    if (!draft) return;

    try {
      setStatus("syncing");
      const token = await getToken();
      if (!token) { setStatus("error", "Your session expired. Sign in again to continue syncing."); return; }
      const resume = resumeId.current
        ? await ResumeService.updateResume(resumeId.current, payloadFromDraft(draft), token)
        : await ResumeService.createResume(payloadFromDraft(draft), token);
      resumeId.current = resume.id;
      useResumeStore.getState().setCloudSyncState({ cloudResumeId: resume.id, syncStatus: "idle", syncError: null, lastSyncedAt: new Date().toISOString() });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Cloud sync could not be completed.";
      setStatus(navigator.onLine ? "error" : "offline", message);
    }
  }, [getToken, setStatus, userId]);

  const scheduleSync = useCallback(() => {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => { void sync(); }, 800);
  }, [sync]);

  useEffect(() => {
    ResumeService.configureTokenProvider(async () => getToken());
    return () => ResumeService.configureTokenProvider(null);
  }, [getToken]);

  useEffect(() => {
    if (!isLoaded || !userId || !user) return;
    let cancelled = false;
    bootstrapping.current = true;

    const bootstrap = async () => {
      try {
        setStatus("syncing");
        const token = await getToken();
        if (!token) throw new Error("Your session expired. Sign in again to continue syncing.");
        const cloudResumes = await ResumeService.getResumes(token);
        const preferredId = window.localStorage.getItem(`resumeos:cloud-resume-id:${userId}`);
        const cloud = cloudResumes.find((resume) => resume.id === preferredId) ?? cloudResumes[0];
        const local = readResumeDraft();

        if (cancelled) return;
        if (cloud && (!local || Date.parse(cloud.updatedAt) >= updatedAt(local))) {
          if (isDraft(cloud.resumeJson)) {
            ignoreNextDraftSync.current = true;
            saveResumeDraft(cloud.resumeJson);
            window.dispatchEvent(new Event(CLOUD_DRAFT_RESTORED_EVENT));
          }
          resumeId.current = cloud.id;
        } else if (local && cloud) {
          const updated = await ResumeService.updateResume(cloud.id, payloadFromDraft(local), token);
          resumeId.current = updated.id;
        } else if (local) {
          const created = await ResumeService.createResume(payloadFromDraft(local), token);
          resumeId.current = created.id;
        }

        if (resumeId.current) window.localStorage.setItem(`resumeos:cloud-resume-id:${userId}`, resumeId.current);
        useResumeStore.getState().setCloudSyncState({ cloudResumeId: resumeId.current, syncStatus: "idle", syncError: null, lastSyncedAt: new Date().toISOString() });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Cloud sync could not be initialized.";
        setStatus(navigator.onLine ? "error" : "offline", message);
      } finally {
        bootstrapping.current = false;
      }
    };

    void bootstrap();
    return () => { cancelled = true; };
  }, [getToken, isLoaded, setStatus, user, userId]);

  useEffect(() => {
    const handleDraftChange = () => {
      if (ignoreNextDraftSync.current) {
        ignoreNextDraftSync.current = false;
        return;
      }
      scheduleSync();
    };
    const handleOnline = () => scheduleSync();
    const handleOffline = () => setStatus("offline");
    window.addEventListener(DRAFT_EVENT, handleDraftChange);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener(DRAFT_EVENT, handleDraftChange);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [scheduleSync, setStatus]);

  return <>{children}</>;
}
