/**
 * Mock data barrel export
 * 
 * All mock/fixture data used during development is re-exported here.
 * When backend is connected, replace each export with a real API call
 * in the corresponding service (src/services/).
 * 
 * Usage: import { MOCK_APPLICATIONS, TIMELINE_EVENTS } from '@/data';
 */

export * from './mock-resume';
export * from './mock-tracker';
export * from './mock-coach';
export * from './mock-analyzer';
// Note: mock-dashboard has ACTIVITY_FEED which conflicts with mock-tracker.
// Using explicit named exports to resolve ambiguity.
export {
  DASHBOARD_STATS,
  RECENT_RESUMES,
  RESUME_HEALTH_DATA,
  ACTIVITY_FEED as DASHBOARD_ACTIVITY_FEED,
  QUICK_ACTIONS,
  UPCOMING_FEATURES,
} from './mock-dashboard';
export * from './templates-data';

