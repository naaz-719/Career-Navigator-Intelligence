// ─── HirePilot AI — Intelligence Engine Types ────────────────────────────────
// Canonical interfaces for the shared intelligence layer.
// Every module's compute* function returns IntelligenceResult (or an extension).
// Backend seam: swap any module's function body with a fetch() call — the shape
// defined here is what the real API must also return.

import type { AppProfile } from '@/context/ProfileContext';

// Re-export AppProfile as the canonical user profile across the entire engine.
// The only place UserProfile should exist outside this file is the decision
// engine form (which adds a transient `question` field on top of AppProfile).
export type { AppProfile };

// ─── Shared primitives ───────────────────────────────────────────────────────

export interface Factor {
  /** Human-readable label shown to the user */
  label: string;
  /** Whether this factor helps, hurts, or is neutral */
  impact: 'positive' | 'negative' | 'neutral';
  /** 0–100 relative weight / contribution to the primary score */
  weight: number;
  /** One-line elaboration shown in the WhyPanel */
  detail: string;
}

export interface SuggestedAction {
  action: string;
  priority: 'high' | 'medium' | 'low';
  timeframe: string;
  link?: string;
  linkLabel?: string;
}

export type RiskTier = 'low' | 'medium' | 'high' | 'critical';

// ─── Canonical result shape ───────────────────────────────────────────────────
// Every intelligence module returns this shape (possibly extended with extra
// domain-specific fields). Real APIs must preserve all seven base fields.

export interface IntelligenceResult {
  /** Primary 0–100 score for this module */
  score: number;
  /** 0–100 probability of a positive career outcome */
  probability: number;
  /** 0–100 model confidence in the prediction */
  confidence: number;
  /** Narrative explanation suitable for user display */
  reasoning: string;
  /** Ordered list of factors that drove the score */
  contributingFactors: Factor[];
  /** Overall risk assessment */
  riskLevel: RiskTier;
  /** Prioritised next actions for the user */
  suggestedActions: SuggestedAction[];
}
