import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, Trash2, RotateCcw, Clock } from 'lucide-react';
import type { AnalysisHistoryEntry, DecisionResult } from './types';

interface Props {
  history: AnalysisHistoryEntry[];
  onRestore: (result: DecisionResult) => void;
  onClear: () => void;
}

const PROB_COLOR = (p: number) =>
  p >= 75 ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25' :
  p >= 55 ? 'text-amber-400 bg-amber-500/10 border-amber-500/25' :
             'text-red-400 bg-red-500/10 border-red-500/25';

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins  = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days  = Math.floor(diff / 86_400_000);
  if (mins < 2)   return 'Just now';
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export default function AnalysisHistory({ history, onRestore, onClear }: Props) {
  if (history.length === 0) return null;

  return (
    <div className="bg-card/50 border border-border/40 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <History className="h-4 w-4 text-primary" />
          Past Analyses
          <span className="text-xs font-normal text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded-full">{history.length}</span>
        </div>
        <button
          onClick={onClear}
          className="flex items-center gap-1 text-xs text-muted-foreground/60 hover:text-destructive transition-colors"
          title="Clear history"
        >
          <Trash2 className="h-3 w-3" /> Clear
        </button>
      </div>

      <AnimatePresence initial={false}>
        <div className="space-y-2">
          {history.map((entry, i) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ delay: i * 0.04 }}
              className="group flex items-start justify-between gap-3 p-3 rounded-lg border border-border/30 bg-background/30 hover:bg-muted/20 hover:border-primary/20 transition-all cursor-pointer"
              onClick={() => onRestore(entry.result)}
            >
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground leading-snug line-clamp-2 mb-1.5">
                  "{entry.question}"
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${PROB_COLOR(entry.hireProbability)}`}>
                    {entry.hireProbability}% hire prob.
                  </span>
                  <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                    <Clock className="h-2.5 w-2.5" /> {relativeTime(entry.generatedAt)}
                  </span>
                </div>
              </div>
              <button
                className="flex-shrink-0 flex items-center gap-1 text-xs text-muted-foreground/50 group-hover:text-primary transition-colors mt-0.5"
                title="Restore this analysis"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </div>
  );
}
