import { useState, useCallback } from 'react';
import type { DecisionResult, AnalysisHistoryEntry } from '@/components/decision-engine/types';

const STORAGE_KEY = 'hirepilot_analysis_history';
const MAX_ENTRIES = 6;

function readHistory(): AnalysisHistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AnalysisHistoryEntry[]) : [];
  } catch {
    return [];
  }
}

function writeHistory(entries: AnalysisHistoryEntry[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(0, MAX_ENTRIES)));
  } catch {
    // storage full — ignore
  }
}

export function useAnalysisHistory() {
  const [history, setHistory] = useState<AnalysisHistoryEntry[]>(readHistory);

  const addEntry = useCallback((result: DecisionResult) => {
    const entry: AnalysisHistoryEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      question: result.question.length > 80 ? result.question.slice(0, 77) + '…' : result.question,
      hireProbability: result.hireProbability,
      topCountry: result.topCountry,
      sector: result.profile.sector,
      generatedAt: result.generatedAt,
      result,
    };
    setHistory((prev) => {
      const next = [entry, ...prev].slice(0, MAX_ENTRIES);
      writeHistory(next);
      return next;
    });
  }, []);

  const clearHistory = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setHistory([]);
  }, []);

  return { history, addEntry, clearHistory };
}
