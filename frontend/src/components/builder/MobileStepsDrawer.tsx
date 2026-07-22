'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Circle, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BuilderState, STEP_LABELS } from '@/types';

const OPTIONAL_STEPS = new Set([3, 7, 10, 11, 12, 13, 14]);

interface MobileStepsDrawerProps {
  state: BuilderState;
  onGoToStep: (n: number) => void;
  onClose: () => void;
}

/**
 * Mobile bottom-sheet drawer for navigating builder steps.
 * Extracted from BuilderPage to keep the page file clean.
 */
export function MobileStepsDrawer({ state, onGoToStep, onClose }: MobileStepsDrawerProps) {
  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      className="fixed inset-x-0 bottom-0 z-50 bg-background border-t border-border/50 shadow-2xl rounded-t-3xl max-h-[80vh] overflow-y-auto"
    >
      <div className="flex items-center justify-between p-5 border-b border-border/50">
        <h3 className="font-bold text-lg">All Sections</h3>
        <button onClick={onClose} className="p-2 rounded-full hover:bg-muted transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="p-4 space-y-1">
        {STEP_LABELS.map((label, i) => {
          const done = i < state.currentStep;
          const active = i === state.currentStep;
          return (
            <button
              key={i}
              onClick={() => { onGoToStep(i); onClose(); }}
              className={cn(
                'w-full flex items-center gap-3 py-3 px-4 rounded-xl text-sm text-left transition-colors',
                active
                  ? 'bg-accent/10 text-accent font-semibold'
                  : done
                  ? 'text-foreground/80 hover:bg-muted'
                  : 'text-muted-foreground hover:bg-muted'
              )}
            >
              {done
                ? <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                : <Circle className={cn('w-4 h-4 shrink-0', active ? 'text-accent' : 'text-muted-foreground/30')} />
              }
              <span>{i + 1}. {label}</span>
              {OPTIONAL_STEPS.has(i) && <span className="ml-auto text-xs text-muted-foreground/50">optional</span>}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
