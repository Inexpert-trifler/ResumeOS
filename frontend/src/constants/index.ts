/**
 * Centralized application constants
 * All magic strings, numbers, and configuration values live here.
 * 
 * Usage: import { ROUTES, UI_CONSTANTS } from '@/constants';
 */

// ============================
// ROUTING
// ============================
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  BUILDER: '/builder',
  STUDIO: '/studio',
  ANALYZER: '/analyzer',
  COACH: '/coach',
  TRACKER: '/tracker',
  ACADEMY: '/academy',
  TEMPLATES: '/templates',
  SETTINGS: '/settings',
  ABOUT: '/about',
  CONTACT: '/contact',
} as const;

export type AppRoute = typeof ROUTES[keyof typeof ROUTES];

// ============================
// API ENDPOINTS
// ============================
export const API_ENDPOINTS = {
  RESUMES: '/api/resumes',
  ANALYZE: '/api/analyze',
  COACH: '/api/coach',
  TEMPLATES: '/api/templates',
  PDF: '/api/pdf',
  USER: '/api/user',
} as const;

// ============================
// UI DIMENSIONS & LAYOUT
// ============================
export const UI_CONSTANTS = {
  SIDEBAR_WIDTH: 260,
  SIDEBAR_COLLAPSED_WIDTH: 80,
  TOPNAV_HEIGHT: 56,
  MAX_CONTENT_WIDTH: 1400,
} as const;

// ============================
// ANIMATION PRESETS
// ============================
export const ANIMATION = {
  DURATION: {
    FAST: 0.15,
    DEFAULT: 0.3,
    SLOW: 0.5,
  },
  EASE: {
    SPRING: [0.21, 0.47, 0.32, 0.98] as [number, number, number, number],
    LINEAR: [0, 0, 1, 1] as [number, number, number, number],
    OUT: [0, 0, 0.2, 1] as [number, number, number, number],
  },
  STAGGER: {
    DEFAULT: 0.08,
    FAST: 0.04,
    SLOW: 0.15,
  },
} as const;

// ============================
// BREAKPOINTS (matching Tailwind defaults)
// ============================
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

// ============================
// TRACKER
// ============================
export const JOB_STATUSES = ['applied', 'interviewing', 'offer', 'rejected', 'wishlist', 'saved'] as const;
export type JobStatus = typeof JOB_STATUSES[number];

// ============================
// ANALYZER
// ============================
export const ATS_SCORE_THRESHOLDS = {
  EXCELLENT: 80,
  GOOD: 65,
  FAIR: 50,
  POOR: 0,
} as const;
