'use client';

import { useState, useEffect } from 'react';

/**
 * Delays updating a value until after the specified wait time has elapsed
 * since the last change. Useful for search inputs and expensive computations.
 * 
 * @example const debouncedSearch = useDebounce(searchQuery, 300);
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
