'use client';

import { useEffect, useRef, RefObject } from 'react';

/**
 * Detects clicks outside of a referenced element.
 * Useful for closing dropdowns, modals, and popovers.
 * 
 * @example const ref = useClickOutside<HTMLDivElement>(() => setOpen(false));
 * @example <div ref={ref}>...</div>
 */
export function useClickOutside<T extends HTMLElement = HTMLElement>(
  handler: () => void
): RefObject<T | null> {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const el = ref?.current;
      if (!el || el.contains((event?.target as Node) || null)) {
        return;
      }
      handler();
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [handler]);

  return ref;
}

