/**
 * Centralized hooks barrel export
 * 
 * Usage: import { useDebounce, useLocalStorage } from '@/hooks';
 */

// Existing hooks
export { useIsMobile } from './use-mobile';

// New architecture hooks
export { useDebounce } from './useDebounce';
export { useLocalStorage } from './useLocalStorage';
export { useWindowSize } from './useWindowSize';
export { useMediaQuery } from './useMediaQuery';
export { useClipboard } from './useClipboard';
export { useClickOutside } from './useClickOutside';
