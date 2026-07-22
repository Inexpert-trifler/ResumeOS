/**
 * Application-level configuration
 * 
 * All environment variables and app-level config should be accessed
 * through this module — never directly from process.env in components.
 * 
 * To add a new env variable:
 * 1. Add it to .env.local
 * 2. Expose it here with a fallback
 * 3. Import from '@/config' in your component or service
 */

export const appConfig = {
  // Application metadata
  app: {
    name: 'ResumeOS',
    description: 'The AI-powered resume builder for modern job seekers.',
    url: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
    version: process.env.NEXT_PUBLIC_APP_VERSION ?? '1.0.0',
  },

  // Feature flags (toggle features without code changes)
  features: {
    enableAiCoach: process.env.NEXT_PUBLIC_ENABLE_AI_COACH !== 'false',
    enablePdfExport: process.env.NEXT_PUBLIC_ENABLE_PDF_EXPORT !== 'false',
    enableJobTracker: process.env.NEXT_PUBLIC_ENABLE_JOB_TRACKER !== 'false',
    enableAnalyzer: process.env.NEXT_PUBLIC_ENABLE_ANALYZER !== 'false',
    enableTemplates: process.env.NEXT_PUBLIC_ENABLE_TEMPLATES !== 'false',
  },

  // API configuration
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL ?? '/api',
    timeout: 30_000,
  },
} as const;

export type AppConfig = typeof appConfig;
