"use client";

/**
 * ClientProviders — groups all client-only providers into a single boundary.
 *
 * Why this exists:
 * Next.js 16 Turbopack pre-renders special pages (/_not-found, /_global-error)
 * using the root layout. @base-ui/react's TooltipPrimitive.Provider calls
 * useContext internally in a way that crashes Turbopack's SSR bundle when
 * React's internal context is null. By wrapping ALL providers in a single
 * "use client" component, they are treated as a unified client boundary and
 * are not executed during server-side prerendering of those special pages.
 */

import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/providers/theme-provider";
import { CloudSyncProvider } from "@/providers/cloud-sync-provider";
import { SmoothScrollProvider } from "@/providers/smooth-scroll-provider";
import { TooltipProvider } from "@/components/ui/tooltip";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <CloudSyncProvider>
          <SmoothScrollProvider>
            <TooltipProvider>{children}</TooltipProvider>
          </SmoothScrollProvider>
        </CloudSyncProvider>
      </ThemeProvider>
    </ClerkProvider>
  );
}
