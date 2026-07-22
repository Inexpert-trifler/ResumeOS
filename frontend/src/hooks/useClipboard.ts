'use client';

import { useState, useCallback } from 'react';

type CopiedValue = string | null;

/**
 * Copies text to the clipboard and tracks copied state with an auto-reset timer.
 * Useful for "Copy Link" and "Copy Code" buttons.
 * 
 * @example const { copy, copied } = useClipboard();
 * @example <button onClick={() => copy('text')}>{copied ? 'Copied!' : 'Copy'}</button>
 */
export function useClipboard(resetDelay = 2000) {
  const [copied, setCopied] = useState(false);
  const [copiedText, setCopiedText] = useState<CopiedValue>(null);

  const copy = useCallback(async (text: string): Promise<boolean> => {
    if (!navigator?.clipboard) {
      console.warn('[useClipboard] Clipboard API not available');
      return false;
    }
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setCopiedText(text);
      setTimeout(() => setCopied(false), resetDelay);
      return true;
    } catch {
      setCopied(false);
      setCopiedText(null);
      return false;
    }
  }, [resetDelay]);

  return { copy, copied, copiedText };
}
