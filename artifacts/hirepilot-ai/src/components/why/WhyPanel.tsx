import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown, ChevronUp, TrendingUp, TrendingDown, Minus, Lightbulb, CheckCircle2 } from 'lucide-react';
import type { WhyData, WhyFactor } from './types';

// ─── Factor row ───────────────────────────────────────────────────────────────
function FactorRow({ factor }: { factor: WhyFactor }) {
  const isPos = factor.impact === 'positive';
  const isNeg = factor.impact === 'negative';
  const Icon  = isPos ? TrendingUp : isNeg ? TrendingDown : Minus;
  const barColor   = isPos ? 'bg-emerald-500/70' : isNeg ? 'bg-red-500/70' : 'bg-muted-foreground/40';
  const valueColor = isPos ? 'text-emerald-400'  : isNeg ? 'text-red-400'   : 'text-muted-foreground';
  const iconColor  = isPos ? 'text-emerald-400'  : isNeg ? 'text-red-400'   : 'text-muted-foreground';

  return (
    <div className="flex items-center gap-2.5 group">
      <Icon className={`h-3 w-3 flex-shrink-0 ${iconColor}`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2 mb-0.5">
          <span className="text-xs text-foreground/80 truncate">{factor.label}</span>
          <span className={`text-xs font-semibold flex-shrink-0 ${valueColor}`}>{factor.valueLabel}</span>
        </div>
        <div className="h-1 rounded-full bg-muted/40 overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${barColor}`}
            initial={{ width: 0 }}
            animate={{ width: `${factor.barWidth}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
        {factor.detail && (
          <p className="text-[10px] text-muted-foreground/60 mt-0.5 leading-snug">{factor.detail}</p>
        )}
      </div>
    </div>
  );
}

// ─── Confidence bar ───────────────────────────────────────────────────────────
function ConfidenceBar({ value, reason }: { value: number; reason: string }) {
  const color = value >= 80 ? 'bg-emerald-500' : value >= 60 ? 'bg-primary' : 'bg-amber-500';
  const label = value >= 80 ? 'High'           : value >= 60 ? 'Medium'     : 'Low';
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Model Confidence</span>
        <span className={`text-xs font-bold ${value >= 80 ? 'text-emerald-400' : value >= 60 ? 'text-primary' : 'text-amber-400'}`}>
          {value}% — {label}
        </span>
      </div>
      <div className="h-1 rounded-full bg-muted/40 overflow-hidden mb-1">
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
        />
      </div>
      <p className="text-[10px] text-muted-foreground/70 leading-snug">{reason}</p>
    </div>
  );
}

// ─── Main WhyPanel ────────────────────────────────────────────────────────────
interface Props {
  data: WhyData;
  /** 'badge' shows a "Why?" pill. 'icon' shows just the ? icon. Default: 'badge' */
  trigger?: 'badge' | 'icon';
  className?: string;
}

export default function WhyPanel({ data, trigger = 'badge', className = '' }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`inline-block w-full ${className}`}>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(v => !v)}
        className={`flex items-center gap-1 transition-colors group ${
          trigger === 'badge'
            ? 'text-[10px] font-medium px-2 py-0.5 rounded-full border border-border/40 bg-muted/20 hover:bg-primary/10 hover:border-primary/30 hover:text-primary text-muted-foreground/70'
            : 'text-muted-foreground/50 hover:text-primary'
        }`}
        aria-expanded={open}
      >
        <HelpCircle className={trigger === 'badge' ? 'h-2.5 w-2.5' : 'h-3.5 w-3.5'} />
        {trigger === 'badge' && <span>Why?</span>}
        {open
          ? <ChevronUp className="h-2.5 w-2.5 opacity-60" />
          : <ChevronDown className="h-2.5 w-2.5 opacity-60" />}
      </button>

      {/* Expandable panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="mt-2 p-3.5 rounded-xl border border-primary/15 bg-gradient-to-br from-primary/5 via-card/80 to-accent/5 backdrop-blur-sm space-y-3.5">

              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-primary/70 mb-0.5">How this was calculated</p>
                  <p className="text-xs font-semibold text-foreground">{data.metricLabel}</p>
                </div>
                <button onClick={() => setOpen(false)} className="text-muted-foreground/40 hover:text-muted-foreground flex-shrink-0 mt-0.5">
                  <ChevronUp className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Methodology */}
              <p className="text-[11px] text-muted-foreground leading-relaxed border-b border-border/20 pb-3">{data.methodology}</p>

              {/* Contributing factors */}
              {data.factors.length > 0 && (
                <div className="space-y-2.5">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">Contributing Factors</p>
                  {data.factors.map((f, i) => <FactorRow key={i} factor={f} />)}
                </div>
              )}

              {/* Confidence */}
              <div className="border-t border-border/20 pt-3">
                <ConfidenceBar value={data.confidence} reason={data.confidenceReason} />
              </div>

              {/* Assumptions */}
              {data.assumptions.length > 0 && (
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 mb-1.5">Assumptions</p>
                  <ul className="space-y-1">
                    {data.assumptions.map((a, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-[10px] text-muted-foreground/70 leading-snug">
                        <CheckCircle2 className="h-2.5 w-2.5 text-muted-foreground/40 flex-shrink-0 mt-0.5" />
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommendation */}
              <div className="flex items-start gap-2 p-2.5 rounded-lg bg-primary/8 border border-primary/15">
                <Lightbulb className="h-3.5 w-3.5 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-[11px] text-foreground/80 leading-snug">{data.recommendation}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
