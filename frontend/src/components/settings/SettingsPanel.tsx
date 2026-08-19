"use client";

import { useState, useEffect } from "react";
import { Settings, User, Palette, FileText, Type, Check, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SettingsService, type UserSettingsData, type UserProfileData } from "@/services/SettingsService";
import { useAuth, useUser } from "@clerk/nextjs";
import { useTheme } from "@/providers/theme-provider";

export function SettingsPanel() {
  const { isLoaded } = useAuth();
  const { user: clerkUser } = useUser();
  // Global theme state — this is the single source of truth that controls document.documentElement
  const { theme: globalTheme, setTheme: applyGlobalTheme } = useTheme();

  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [settings, setSettings] = useState<UserSettingsData>({
    theme: "system",
    defaultTemplate: "classic",
    defaultFont: "Inter",
    accentColor: "#6366f1",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded) {
      void SettingsService.getSettings()
        .then((res) => {
          setProfile(res.user);
          setSettings(res.settings);
          // If the backend has a stored theme preference that differs from the
          // current provider state, sync it so the page renders correctly.
          const saved = res.settings.theme as "system" | "dark" | "light" | undefined;
          if (saved && saved !== globalTheme) {
            applyGlobalTheme(saved);
          }
          setIsLoading(false);
        })
        .catch((err) => {
          setError(err instanceof Error ? err.message : "Failed to load settings.");
          setIsLoading(false);
        });
    }
    // applyGlobalTheme and globalTheme are stable — only re-run when auth loads
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    try {
      const updated = await SettingsService.updateSettings(settings);
      setSettings(updated);
      setIsSaving(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save settings.");
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 space-y-8">

      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <Settings className="w-6 h-6 text-accent" /> Account Settings & Preferences
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Synchronized automatically across your ResumeOS workspace
          </p>
        </div>
        {savedSuccess && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-semibold">
            <Check className="w-4 h-4" /> Preferences Saved!
          </div>
        )}
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center p-12 text-muted-foreground">
          <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading profile settings...
        </div>
      ) : (
        <div className="space-y-6">

          {/* Profile Card */}
          <div className="p-6 rounded-3xl border border-border/50 bg-card shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-border/40 text-sm font-bold">
              <User className="w-4 h-4 text-accent" /> Profile Information
            </div>
            <div className="flex items-center gap-4">
              {clerkUser?.imageUrl ? (
                <img src={clerkUser.imageUrl} alt="Avatar" className="w-14 h-14 rounded-full border-2 border-accent/40 object-cover" />
              ) : (
                <div className="w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-xl">
                  {clerkUser?.firstName?.[0] || "U"}
                </div>
              )}
              <div>
                <h3 className="font-bold text-base">{clerkUser?.fullName || profile?.name || "ResumeOS User"}</h3>
                <p className="text-xs text-muted-foreground">{clerkUser?.primaryEmailAddress?.emailAddress || profile?.email}</p>
                <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 mt-1">
                  Clerk Authenticated
                </span>
              </div>
            </div>
          </div>

          {/* Appearance Preferences */}
          <div className="p-6 rounded-3xl border border-border/50 bg-card shadow-sm space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-border/40 text-sm font-bold">
              <Palette className="w-4 h-4 text-accent" /> Theme & Appearance
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground">Theme Preference</label>
              <div className="grid grid-cols-3 gap-3">
                {(["system", "dark", "light"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      // Apply to document.documentElement IMMEDIATELY via global provider
                      applyGlobalTheme(t);
                      // Keep local settings state in sync for the save-to-backend flow
                      setSettings((prev) => ({ ...prev, theme: t }));
                    }}
                    className={`h-10 rounded-xl border text-xs font-semibold capitalize transition-all ${
                      globalTheme === t ? "border-accent bg-accent/10 text-accent" : "border-border/60 bg-background text-muted-foreground"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Default Resume Preferences */}
          <div className="p-6 rounded-3xl border border-border/50 bg-card shadow-sm space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-border/40 text-sm font-bold">
              <FileText className="w-4 h-4 text-accent" /> Resume Defaults
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-accent" /> Default Template
                </label>
                <select
                  value={settings.defaultTemplate}
                  onChange={(e) => setSettings({ ...settings, defaultTemplate: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl bg-background border border-border/60 text-xs focus:outline-none focus:border-accent"
                >
                  <option value="classic">Classic Professional</option>
                  <option value="modern">Modern Minimalist</option>
                  <option value="executive">Executive Bold</option>
                  <option value="compact">Compact Technical</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                  <Type className="w-3.5 h-3.5 text-accent" /> Default Typography Font
                </label>
                <select
                  value={settings.defaultFont}
                  onChange={(e) => setSettings({ ...settings, defaultFont: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl bg-background border border-border/60 text-xs focus:outline-none focus:border-accent"
                >
                  <option value="Inter">Inter (Sans)</option>
                  <option value="Georgia">Georgia (Serif)</option>
                  <option value="Roboto">Roboto (Clean)</option>
                  <option value="Outfit">Outfit (Modern)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <Button
            onClick={handleSave}
            disabled={isSaving}
            size="lg"
            className="w-full h-12 rounded-2xl bg-accent text-accent-foreground font-semibold gap-2 shadow-md hover:bg-accent/90"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Saving Preferences...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> Save Preferences
              </>
            )}
          </Button>

        </div>
      )}

    </div>
  );
}
