import React from "react";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className, size = "md" }: LogoProps) {
  let sizeClass = "w-8 h-8";
  if (size === "sm") {
    sizeClass = "w-7 h-7";
  } else if (size === "lg") {
    sizeClass = "w-10 h-10";
  }

  return (
    <img
      src="/assets/logo.png"
      alt="ResumeOS Logo"
      className={`${sizeClass} object-contain shrink-0 ${className || ""}`}
    />
  );
}
