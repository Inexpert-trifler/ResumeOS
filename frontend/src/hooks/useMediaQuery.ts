'use client';

import { useState, useEffect } from 'react';

/**
 * Tracks whether a CSS media query matches, reacting to changes.
 * Safe for SSR — returns false during server-side rendering.
 * 
 * @example const isMobile = useMediaQuery('(max-width: 768px)');
 * @example const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const media = window.matchMedia(query);

    const listener = (event: MediaQueryListEvent) => setMatches(event.matches);
    media.addEventListener('change', listener);

    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}
