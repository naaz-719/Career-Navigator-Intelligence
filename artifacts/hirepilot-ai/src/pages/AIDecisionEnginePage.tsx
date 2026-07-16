import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, ChevronRight } from 'lucide-react';

import InputForm from '@/components/decision-engine/InputForm';
import ReasoningProgress from '@/components/decision-engine/ReasoningProgress';
import ResultPanel from '@/components/decision-engine/ResultPanel';

import type { UserProfile, ReasoningModule, DecisionResult, ModuleId } from '@/components/decision-engine/types';
import { MODULE_DEFINITIONS, runDecisionEngine } from '@/services/decisionEngine';

// ─── Step type ────────────────────────────────────────────────────────────────
type Step = 'input' | 'reasoning' | 'result';

// ─── Initial module state factory ────────────────────────────────────────────
function buildInitialModules(): ReasoningModule[] {
  return MODULE_DEFINITIONS.map((def) => ({
    ...def,
    status: 'idle',
    thoughts: [],
    summary: '',
    durationMs: 0,
  }));
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AIDecisionEnginePage() {
  const [step, setStep] = useState<Step>('input');
  const [modules, setModules] = useState<ReasoningModule[]>(buildInitialModules());
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [result, setResult] = useState<DecisionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const moduleStartTimes = useRef<Record<string, number>>({});

  const updateModule = useCallback((id: ModuleId, patch: Partial<ReasoningModule>) => {
    setModules((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...patch } : m))
    );
  }, []);

  const handleSubmit = useCallback(async (profile: UserProfile) => {
    setIsLoading(true);
    const freshModules = buildInitialModules();
    setModules(freshModules);
    setCurrentModuleIndex(0);
    setResult(null);

    // Small delay so the step transition feels intentional
    await new Promise((r) => setTimeout(r, 300));
    setStep('reasoning');
    setIsLoading(false);

    await runDecisionEngine(profile, {
      onModuleStart: (moduleId) => {
        const idx = MODULE_DEFINITIONS.findIndex((m) => m.id === moduleId);
        setCurrentModuleIndex(idx);
        moduleStartTimes.current[moduleId] = Date.now();
        updateModule(moduleId, { status: 'running', thoughts: [] });
      },
      onThought: (moduleId, thought) => {
        setModules((prev) =>
          prev.map((m) =>
            m.id === moduleId ? { ...m, thoughts: [...m.thoughts, thought] } : m
          )
        );
      },
      onModuleComplete: (moduleId, summary) => {
        const duration = Date.now() - (moduleStartTimes.current[moduleId] ?? Date.now());
        updateModule(moduleId, { status: 'complete', summary, durationMs: duration });
      },
      onComplete: (engineResult) => {
        setResult(engineResult);
        // Brief pause so the user sees all modules "done" before transitioning
        setTimeout(() => setStep('result'), 800);
      },
    });
  }, [updateModule]);

  const handleReset = useCallback(() => {
    setStep('input');
    setModules(buildInitialModules());
    setCurrentModuleIndex(0);
    setResult(null);
  }, []);

  return (
    <div className="space-y-8">
      {/* ── Page header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/20 flex items-center justify-center">
              <Brain className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">AI Decision Engine</h1>
              <p className="text-sm text-muted-foreground">
                Ask any career question — get an explainable, data-driven recommendation
              </p>
            </div>
          </div>
        </div>

        {/* Step breadcrumb */}
        <div className="flex items-center gap-2 text-sm flex-shrink-0 mt-1">
          {(['input', 'reasoning', 'result'] as Step[]).map((s, i) => {
            const labels = ['Question', 'Analysis', 'Recommendation'];
            const isActive = s === step;
            const isPast = ['input', 'reasoning', 'result'].indexOf(step) > i;
            return (
              <React.Fragment key={s}>
                <span className={`font-medium transition-colors ${
                  isActive ? 'text-primary' : isPast ? 'text-muted-foreground' : 'text-muted-foreground/40'
                }`}>
                  {labels[i]}
                </span>
                {i < 2 && <ChevronRight className={`h-3.5 w-3.5 flex-shrink-0 ${isPast ? 'text-muted-foreground/60' : 'text-muted-foreground/25'}`} />}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* ── Step indicator dots ── */}
      <div className="flex items-center gap-3">
        {(['input', 'reasoning', 'result'] as Step[]).map((s, i) => {
          const stepOrder = ['input', 'reasoning', 'result'];
          const currentIdx = stepOrder.indexOf(step);
          const isDone = currentIdx > i;
          const isActive = s === step;
          return (
            <React.Fragment key={s}>
              <div className={`flex items-center justify-center h-7 w-7 rounded-full text-xs font-bold transition-all duration-300 ${
                isActive
                  ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-110'
                  : isDone
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-muted/30 text-muted-foreground/40'
              }`}>
                {isDone ? '✓' : i + 1}
              </div>
              {i < 2 && (
                <div className={`flex-1 h-px max-w-[60px] transition-all duration-500 ${
                  isDone ? 'bg-emerald-500/40' : isActive ? 'bg-primary/30' : 'bg-border/20'
                }`} />
              )}
            </React.Fragment>
          );
        })}
        <div className="ml-2 text-xs text-muted-foreground/60">
          {step === 'input' && 'Enter your question and profile'}
          {step === 'reasoning' && 'AI is analysing across 6 intelligence modules…'}
          {step === 'result' && 'Analysis complete — explainable recommendation ready'}
        </div>
      </div>

      {/* ── How it works callout (input step only) ── */}
      <AnimatePresence>
        {step === 'input' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { step: 1, label: 'Profile Analysis', desc: 'Identity, skills & trajectory', color: 'text-blue-400' },
                { step: 2, label: 'Policy Engine', desc: 'Visa, quotas & regulations', color: 'text-violet-400' },
                { step: 3, label: 'Salary Engine', desc: 'Live market benchmarks', color: 'text-emerald-400' },
                { step: 4, label: 'Market Intel', desc: 'Demand & ghost jobs', color: 'text-amber-400' },
                { step: 5, label: 'Eligibility', desc: 'Sponsor & visa pathways', color: 'text-cyan-400' },
                { step: 6, label: 'Recommendation', desc: 'Explainable output', color: 'text-primary' },
              ].map((item) => (
                <div key={item.step} className="p-3 rounded-xl border border-border/30 bg-card/30 text-center">
                  <span className={`text-xs font-bold ${item.color}`}>{item.step}</span>
                  <p className="text-xs font-medium text-foreground mt-1 leading-tight">{item.label}</p>
                  <p className="text-[10px] text-muted-foreground/70 mt-0.5 leading-snug">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main content area ── */}
      <div className="rounded-2xl border border-border/40 bg-card/30 backdrop-blur-sm p-6 md:p-8">
        <AnimatePresence mode="wait">
          {step === 'input' && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
            >
              <InputForm onSubmit={handleSubmit} isLoading={isLoading} />
            </motion.div>
          )}

          {step === 'reasoning' && (
            <motion.div
              key="reasoning"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
            >
              <ReasoningProgress
                modules={modules}
                currentModuleIndex={currentModuleIndex}
              />
            </motion.div>
          )}

          {step === 'result' && result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4 }}
            >
              <ResultPanel result={result} onReset={handleReset} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Footer disclaimer ── */}
      <p className="text-center text-xs text-muted-foreground/50 pb-4">
        AI Decision Engine v1.0 · Analysis based on GCC market data, government policy databases, and employer hiring patterns ·
        Results are indicative — consult a licensed immigration advisor for visa decisions
      </p>
    </div>
  );
}
