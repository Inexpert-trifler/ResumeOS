"use client";

import { StepWrapper } from "./StepWrapper";
import { BuilderState } from '@/types';
import { cn } from "@/lib/utils";

interface FieldProps {
  label: string;
  required?: boolean;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  icon?: string;
  error?: string;
}

function FloatingField({ label, required, type = "text", value, onChange, placeholder, icon, error }: FieldProps) {
  const hasValue = value.length > 0;
  const inputId = label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return (
    <div className="relative">
      {icon && (
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base pointer-events-none select-none">{icon}</span>
      )}
      <input
        id={inputId}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || " "}
        className={cn(
          "peer w-full bg-card border rounded-xl py-4 px-4 text-sm text-foreground",
          "placeholder:text-transparent focus:placeholder:text-muted-foreground",
          error
            ? "border-destructive/60 focus:outline-none focus:ring-2 focus:ring-destructive/20 focus:border-destructive"
            : "border-border/50 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent",
          "transition-all duration-200",
          icon ? "pl-10" : ""
        )}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${inputId}-error` : undefined}
      />
      <label className={cn(
        "absolute text-xs font-medium pointer-events-none transition-all duration-200",
        "left-4 peer-focus:-top-2.5 peer-focus:text-accent peer-focus:bg-card peer-focus:px-1",
        hasValue ? "-top-2.5 text-accent bg-card px-1" : "top-4 text-muted-foreground"
      )}>
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      {error && (
        <p id={`${inputId}-error`} className="mt-1.5 text-xs text-destructive" aria-live="polite">
          {error}
        </p>
      )}
    </div>
  );
}

interface Step05Props {
  state: BuilderState;
  update: (partial: Partial<BuilderState>) => void;
  validationErrors?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    location?: string;
  };
}

export function Step05_PersonalInfo({ state, update, validationErrors }: Step05Props) {
  const p = state.personalInfo;
  const set = (key: keyof typeof p) => (v: string) =>
    update({ personalInfo: { ...p, [key]: v } });

  return (
    <StepWrapper
      badge="Step 5"
      title="Who are you?"
      description="Just the essentials. We keep it professional — no unnecessary fields."
    >
      <div className="space-y-5 max-w-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FloatingField label="First Name" required value={p.firstName} onChange={set("firstName")} error={validationErrors?.firstName} />
          <FloatingField label="Last Name" required value={p.lastName} onChange={set("lastName")} error={validationErrors?.lastName} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FloatingField label="Email Address" required type="email" value={p.email} onChange={set("email")} icon="✉️" error={validationErrors?.email} />
          <FloatingField label="Phone Number" required type="tel" value={p.phone} onChange={set("phone")} icon="📱" error={validationErrors?.phone} />
        </div>
        <FloatingField label="Location (City, Country)" required value={p.location} onChange={set("location")} icon="📍" placeholder="San Francisco, USA" error={validationErrors?.location} />

        <div className="pt-4 border-t border-border/50">
          <p className="text-sm text-muted-foreground mb-4 font-medium">Online Presence (Optional)</p>
          <div className="space-y-4">
            <FloatingField label="LinkedIn URL" value={p.linkedin} onChange={set("linkedin")} icon="🔗" placeholder="linkedin.com/in/..." />
            <FloatingField label="GitHub URL" value={p.github} onChange={set("github")} icon="🐙" placeholder="github.com/..." />
            <FloatingField label="Portfolio / Website" value={p.portfolio} onChange={set("portfolio")} icon="🌐" placeholder="yourdomain.com" />
          </div>
        </div>
      </div>
    </StepWrapper>
  );
}
