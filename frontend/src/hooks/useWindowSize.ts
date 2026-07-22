'use client';

import { useState, useEffect } from 'react';

interface WindowSize {
  width: number;
  height: number;
}

/**
 * Returns the current window dimensions, updating on resize.
 * Safe for SSR — returns 0x0 during server-side rendering.
 * 
 * @example const { width, height } = useWindowSize();
 */
export function useWindowSize(): WindowSize {
  const [size, setSize] = useState<WindowSize>({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // sync on mount

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}
