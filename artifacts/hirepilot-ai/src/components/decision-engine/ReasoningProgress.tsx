import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserCheck, Scale, Banknote, TrendingUp, ShieldCheck, Sparkles,
  CheckCircle2, Clock, Loader2, Bot, FlaskConical
} from 'lucide-react';

// ─── Source badges ────────────────────────────────────────────────────────────
function ClaudeBadge() {
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-violet-400 bg-violet-500/10 border border-violet-500/20 px-1.5 py-0.5 rounded-full">
      <Bot className="h-2.5 w-2.5" /> Claude AI
    </span>
  );
}

function FormulaBadge() {
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded-full">
      <FlaskConical className="h-2.5 w-2.5" /> Formula-estimated
    </span>
  );
}
import type { ReasoningModule, ModuleId } from './types';

const ICON_MAP: Record<ModuleId, React.ElementType> = {
  profile: UserCheck,
  policy: Scale,
  salary: Banknote,
  market: TrendingUp,
  eligibility: ShieldCheck,
  recommendation: Sparkles,
};

const COLOR_MAP: Record<ModuleId, { bg: string; border: string; text: string; glow: string }> = {
  profile:        { bg: 'bg-blue-500/10',   border: 'border-blue-500/30',   text: 'text-blue-400',   glow: 'shadow-blue-500/20' },
  policy:         { bg: 'bg-violet-500/10', border: 'border-violet-500/30', text: 'text-violet-400', glow: 'shadow-violet-500/20' },
  salary:         { bg: 'bg-emerald-500/10',border: 'border-emerald-500/30',text: 'text-emerald-400',glow: 'shadow-emerald-500/20' },
  market:         { bg: 'bg-amber-500/10',  border: 'border-amber-500/30',  text: 'text-amber-400',  glow: 'shadow-amber-500/20' },
  eligibility:    { bg: 'bg-cyan-500/10',   border: 'border-cyan-500/30',   text: 'text-cyan-400',   glow: 'shadow-cyan-500/20' },
  recommendation: { bg: 'bg-primary/10',    border: 'border-primary/30',    text: 'text-primary',    glow: 'shadow-primary/20' },
};

interface ModuleCardProps {
  module: ReasoningModule;
  index: number;
}

function ModuleCard({ module, index }: ModuleCardProps) {
  const Icon = ICON_MAP[module.id];
  const color = COLOR_MAP[module.id];
  const thoughtsRef = useRef<HTMLDivElement>(null);
  const isRunning = module.status === 'running';
  const isDone = module.status === 'complete';
  const isIdle = module.status === 'idle';

  useEffect(() => {
    if (thoughtsRef.current) {
      thoughtsRef.current.scrollTop = thoughtsRef.current.scrollHeight;
    }
  }, [module.thoughts.length]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: isIdle ? 0.45 : 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className={`relative rounded-xl border p-4 transition-all duration-500 ${
        isRunning
          ? `${color.bg} ${color.border} shadow-lg ${color.glow}`
          : isDone
          ? 'bg-card/50 border-border/40'
          : 'bg-card/20 border-border/20'
      }`}
    >
      {/* Running pulse ring */}
      {isRunning && (
        <motion.div
          className={`absolute inset-0 rounded-xl border-2 ${color.border}`}
          animate={{ opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
            isIdle ? 'bg-muted/30' : isDone ? `${color.bg}` : `${color.bg}`
          }`}>
            <Icon className={`h-4.5 w-4.5 ${isIdle ? 'text-muted-foreground/40' : color.text}`} style={{ height: '1.1rem', width: '1.1rem' }} />
          </div>
          <div>
            <p className={`text-sm font-semibold ${isIdle ? 'text-muted-foreground/50' : 'text-foreground'}`}>
              {module.name}
            </p>
            <p className="text-xs text-muted-foreground/70 leading-tight">{module.description}</p>
          </div>
        </div>

        {/* Status badge */}
        <div className="flex-shrink-0">
          {isIdle && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground/40 px-2 py-0.5 rounded-full border border-border/20">
              <Clock className="h-3 w-3" /> Pending
            </span>
          )}
          {isRunning && (
            <span className={`flex items-center gap-1 text-xs ${color.text} px-2 py-0.5 rounded-full border ${color.border} ${color.bg}`}>
              <Loader2 className="h-3 w-3 animate-spin" /> Running
            </span>
          )}
          {isDone && (
            <span className="flex items-center gap-1 text-xs text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/10">
              <CheckCircle2 className="h-3 w-3" /> Done
            </span>
          )}
        </div>
      </div>

      {/* Thoughts log — terminal style */}
      <AnimatePresence>
        {(isRunning || isDone) && module.thoughts.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            transition={{ duration: 0.25 }}
          >
            <div
              ref={thoughtsRef}
              className="bg-background/60 rounded-lg border border-border/30 p-3 max-h-36 overflow-y-auto space-y-1 font-mono text-[11px] leading-relaxed"
            >
              {module.thoughts.map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-start gap-2"
                >
                  <span className={`flex-shrink-0 mt-0.5 ${isDone ? 'text-emerald-500/60' : color.text + '/60'}`}>›</span>
                  <span className={`${i === module.thoughts.length - 1 && isRunning ? color.text : 'text-muted-foreground'}`}>
                    {t}
                    {i === module.thoughts.length - 1 && isRunning && (
                      <motion.span
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity }}
                        className="ml-0.5 inline-block w-1.5 h-3 bg-current align-middle"
                      />
                    )}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Summary line when done */}
            {isDone && module.summary && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className={`mt-2 px-3 py-2 rounded-lg ${color.bg} ${color.border} border text-xs ${color.text} font-medium`}
              >
                ✓ {module.summary}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

interface Props {
  modules: ReasoningModule[];
  currentModuleIndex: number;
}

export default function ReasoningProgress({ modules, currentModuleIndex }: Props) {
  const completedCount = modules.filter((m) => m.status === 'complete').length;
  const totalCount = modules.length;
  const progress = (completedCount / totalCount) * 100;
  const currentModule = modules[currentModuleIndex];

  return (
    <div className="space-y-6">
      {/* ── Overall progress bar ── */}
      <div className="rounded-xl border border-border/40 bg-card/40 p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="relative h-8 w-8">
              <svg className="h-8 w-8 -rotate-90" viewBox="0 0 32 32">
                <circle cx="16" cy="16" r="13" fill="none" stroke="hsl(var(--border))" strokeWidth="3" />
                <motion.circle
                  cx="16" cy="16" r="13" fill="none"
                  stroke="hsl(var(--primary))" strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 13}`}
                  animate={{ strokeDashoffset: 2 * Math.PI * 13 * (1 - progress / 100) }}
                  transition={{ duration: 0.5 }}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-primary">
                {completedCount}/{totalCount}
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">AI Reasoning in Progress</p>
              <p className="text-xs text-muted-foreground">
                {currentModule?.status === 'running' ? (
                  <span className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                    Running: {currentModule.name}
                  </span>
                ) : completedCount === totalCount ? (
                  <span className="text-emerald-400">All modules complete</span>
                ) : (
                  'Initialising…'
                )}
              </p>
            </div>
          </div>
          <span className="text-2xl font-bold text-primary tabular-nums">{Math.round(progress)}%</span>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 rounded-full bg-muted/50 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Module step indicators */}
        <div className="mt-4 flex items-center gap-1">
          {modules.map((m, i) => {
            const color = COLOR_MAP[m.id];
            return (
              <React.Fragment key={m.id}>
                <div className="flex flex-col items-center gap-1">
                  <div className={`h-2 w-2 rounded-full transition-all duration-300 ${
                    m.status === 'complete' ? 'bg-emerald-400 scale-110' :
                    m.status === 'running' ? `bg-primary animate-pulse scale-125` :
                    'bg-border/50'
                  }`} />
                </div>
                {i < modules.length - 1 && (
                  <div className={`flex-1 h-px transition-all duration-500 ${
                    i < currentModuleIndex ? 'bg-gradient-to-r from-emerald-400/60 to-emerald-400/30' :
                    i === currentModuleIndex - 1 ? 'bg-gradient-to-r from-emerald-400/40 to-primary/30' :
                    'bg-border/20'
                  }`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* ── Module cards 2-col grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {modules.map((module, index) => (
          <ModuleCard key={module.id} module={module} index={index} />
        ))}
      </div>

      {/* ── Source legend + footer ── */}
      <div className="flex items-center justify-center gap-3 flex-wrap">
        <ClaudeBadge />
        <span className="text-xs text-muted-foreground/50">reasoning text is generated by Claude AI</span>
        <span className="text-muted-foreground/30">·</span>
        <FormulaBadge />
        <span className="text-xs text-muted-foreground/50">numbers are formula-computed</span>
      </div>
      <p className="text-center text-xs text-muted-foreground/50">
        AI is analysing your profile across {totalCount} intelligence modules · This usually takes 30–60 seconds
      </p>
    </div>
  );
}
